import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TouchableOpacity,
  ActivityIndicator,
  Dimensions
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { 
  Canvas, 
  Line, 
  Rect, 
  Text as SkiaText, 
  useFont,
  vec,
  LinearGradient,
  Path,
  Group
} from '@shopify/react-native-skia';
import Screen from '../components/Screen';
import { getMilkRecords, getCows } from '../db/database';

const { width: screenWidth } = Dimensions.get('window');
const chartWidth = screenWidth - 40;
const chartHeight = 220;
const barWidth = 30;
const barSpacing = 20;

export default function ReportsScreen({ navigation }) {
  const [timeRange, setTimeRange] = useState('week');
  const [loading, setLoading] = useState(true);
  const [milkData, setMilkData] = useState([]);
  const [cowData, setCowData] = useState([]);

  // Load font for Skia text
//   const font = useFont(require('../assets/fonts/Roboto-Regular.ttf'), 12);

  useEffect(() => {
    const loadReportData = async () => {
      try {
        setLoading(true);
        const [records, cows] = await Promise.all([
          getMilkRecords(),
          getCows()
        ]);
        
        const processedMilkData = processMilkData(records, timeRange);
        const processedCowData = processCowData(cows, records);
        
        setMilkData(processedMilkData);
        setCowData(processedCowData);
      } catch (error) {
        Alert.alert("Error", "Failed to load report data");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadReportData();
  }, [timeRange]);

  const processMilkData = (records, range) => {
    const last7Days = records.slice(0, 7).reverse();
    return {
      labels: last7Days.map(r => r.date.split('-')[2]),
      values: last7Days.map(r => r.litres),
      maxValue: Math.max(...last7Days.map(r => r.litres)),
    };
  };

  const processCowData = (cows, records) => {
    return cows.map(cow => ({
      name: cow.name,
      litres: records
        .filter(r => r.cow_id === cow.id)
        .reduce((sum, r) => sum + r.litres, 0)
    })).sort((a,b) => b.litres - a.litres).slice(0, 5);
  };

  const renderLineChart = () => {
    if (!milkData.values || milkData.values.length === 0 || !font) return null;

    const maxValue = milkData.maxValue || 1;
    const stepX = chartWidth / (milkData.values.length - 1);
    const points = milkData.values.map((value, index) => {
      const x = index * stepX;
      const y = chartHeight - (value / maxValue) * chartHeight;
      return vec(x, y);
    });

    const path = Path.Make();
    points.forEach((point, index) => {
      if (index === 0) {
        path.moveTo(point.x, point.y);
      } else {
        path.lineTo(point.x, point.y);
      }
    });

    return (
      <Canvas style={{ width: chartWidth, height: chartHeight }}>
        {/* X-axis */}
        <Line
          p1={vec(0, chartHeight)}
          p2={vec(chartWidth, chartHeight)}
          color="lightgray"
          strokeWidth={1}
        />

        {/* Y-axis */}
        <Line
          p1={vec(0, 0)}
          p2={vec(0, chartHeight)}
          color="lightgray"
          strokeWidth={1}
        />

        {/* Chart line */}
        <Path
          path={path}
          strokeWidth={2}
          style="stroke"
        >
          <LinearGradient
            start={vec(0, 0)}
            end={vec(chartWidth, chartHeight)}
            colors={['#4CAF50', '#2196F3']}
          />
        </Path>

        {/* Data points */}
        {points.map((point, index) => (
          <Group key={index}>
            <Rect
              x={point.x - 4}
              y={point.y - 4}
              width={8}
              height={8}
              color="#4CAF50"
            />
            <SkiaText
              x={point.x - 10}
              y={chartHeight + 15}
              text={milkData.labels[index]}
              font={font}
              color="black"
            />
            <SkiaText
              x={point.x - 10}
              y={point.y - 10}
              text={milkData.values[index].toString()}
              font={font}
              color="black"
            />
          </Group>
        ))}
      </Canvas>
    );
  };

  const renderBarChart = () => {
    if (!cowData || cowData.length === 0 || !font) return null;

    const maxLitres = Math.max(...cowData.map(cow => cow.litres), 1);
    const availableWidth = chartWidth - (barSpacing * 2);
    const barAreaWidth = availableWidth / cowData.length;
    const barStartX = barSpacing + (barAreaWidth - barWidth) / 2;

    return (
      <Canvas style={{ width: chartWidth, height: chartHeight }}>
        {/* X-axis */}
        <Line
          p1={vec(0, chartHeight)}
          p2={vec(chartWidth, chartHeight)}
          color="lightgray"
          strokeWidth={1}
        />

        {/* Bars */}
        {cowData.map((cow, index) => {
          const x = barStartX + (index * barAreaWidth);
          const barHeight = (cow.litres / maxLitres) * (chartHeight - 40);
          const y = chartHeight - barHeight;

          return (
            <Group key={index}>
              <Rect
                x={x}
                y={y}
                width={barWidth}
                height={barHeight}
                color="#4CAF50"
              />
              <SkiaText
                x={x - 10 + barWidth/2}
                y={chartHeight + 15}
                text={cow.name.substring(0, 5)}
                font={font}
                color="black"
              />
              <SkiaText
                x={x - 10 + barWidth/2}
                y={y - 10}
                text={cow.litres.toFixed(1)}
                font={font}
                color="black"
              />
            </Group>
          );
        })}
      </Canvas>
    );
  };

  if (loading) {
    return (
      <Screen style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </Screen>
    );
  }

  return (
    <Screen style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Time Range Selector */}
        <View style={styles.timeRangeContainer}>
          {['week', 'month', 'year'].map(range => (
            <TouchableOpacity
              key={range}
              style={[
                styles.rangeButton,
                timeRange === range && styles.activeRangeButton
              ]}
              onPress={() => setTimeRange(range)}
            >
              <Text style={[
                styles.rangeButtonText,
                timeRange === range && styles.activeRangeButtonText
              ]}>
                {range.charAt(0).toUpperCase() + range.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Milk Production Chart */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialCommunityIcons name="bottle-tonic-outline" size={20} color="#4CAF50" />
            <Text style={styles.sectionTitle}>Milk Production</Text>
          </View>
          {renderLineChart()}
        </View>

        {/* Top Performing Cows */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialCommunityIcons name="cow" size={20} color="#4CAF50" />
            <Text style={styles.sectionTitle}>Top Producing Cows</Text>
          </View>
          {renderBarChart()}
        </View>

        {/* Export Button */}
        <TouchableOpacity 
          style={styles.exportButton}
          onPress={() => console.log("Export report")}
        >
          <MaterialCommunityIcons name="file-export" size={24} color="white" />
          <Text style={styles.exportButtonText}>Export Report</Text>
        </TouchableOpacity>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    padding: 15,
    paddingBottom: 30,
  },
  timeRangeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  rangeButton: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 15,
    backgroundColor: '#E0E0E0',
  },
  activeRangeButton: {
    backgroundColor: '#4CAF50',
  },
  rangeButtonText: {
    color: '#666',
    fontWeight: '500',
  },
  activeRangeButtonText: {
    color: 'white',
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
    color: '#333',
  },
  exportButton: {
    backgroundColor: '#2196F3',
    borderRadius: 10,
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  exportButtonText: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 10,
    fontSize: 16,
  },
});