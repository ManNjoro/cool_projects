let sidebarOpen = false;
let sidebar = document.getElementById('sidebar')
function openSidebar() {
    if (!sidebarOpen) {
        sidebar.classList.add('sidebar-responsive');
        sidebarOpen = true;
    }
}

function closeSidebar() {
    if (sidebarOpen) {
        sidebar.classList.remove('sidebar-responsive');
        sidebarOpen = false;
    }
}

// Charts
// Bar Chart

var barChartOptions = {
    series: [{
    data: [10, 8, 6, 4, 2],
    name: "Products",
  }],
    chart: {
    type: 'bar',
    background: 'transparent',
    height: 350,
    toolbar:{
        show: false,
    },
  },
  colors: [
    '#2962ff',
    '#d50000',
    '#2e7d32',
    '#ff6d80',
    '#583cb3',
  ],
  plotOptions: {
    bar: {
      borderRadius: 4,
      horizontal: false,
      distributed: true,
      columnWidth: '40%'
    }
  },
  dataLabels: {
    enabled: false
  },
  fills: {
    opacity: 1,
  },
  grid: {
    borderColor: '#55596e',
    yaxis: {
        lines: {
            show: true,
        },
    },
    xaxis: {
        lines: {
            show: true,
        },
    },
  },
  legend: {
    labels: {
        colors: '#f5f7ff',
    },
    show: true,
    position: 'top',
  },
  stroke: {
    colors: ['transparent'],
    show: true,
    width: 2
  },
  tooltip: {
    shared: true,
    intersect: false,
    theme: 'dark',
  },
  xaxis: {
    categories: ['Laptop', 'Phone', 'Monitor', 'Headphones', 'Camera'],
    title: {
        style: {
            color: '#f5f7ff',
        },
    },
    axisBorder: {
        color: '#55596e',
        show: true,
    },
    axisTicks: {
        color: '#55596e',
        show: true,
    },
    labels: {
        style: {
            colors: '#f5f7ff'
        }
    },
  },
  yaxis: {
    title: {
        text: "Count",
        style: {
            color: '#f5f7ff',
        },
    },
    axisBorder: {
        color: '#55596e',
        show: true,
    },
    axisTicks: {
        color: '#55596e',
        show: true,
    },
    labels: {
        style: {
            colors: '#f5f7ff'
        }
    },
  }
  };

  var barChart = new ApexCharts(document.querySelector("#bar-chart"), barChartOptions);
  barChart.render();


//   Area chart

var areaChartOptions = {
    series: [{
    name: 'Purchase Orders',
    data: [31, 40, 28, 51, 42, 109, 100]
  }, {
    name: 'Sales Orders',
    data: [11, 32, 45, 32, 34, 52, 41]
  }],
    chart: {
    height: 350,
    type: 'area',
    background: 'transparent',
    stacked: false,
    toolbar: {
        show: false,
    }
  },
  colors: ['#00ab57', '#d50000'],
  stroke: {
    curve: 'smooth'
  },
  fill: {
    type:'gradient',
    gradient: {
        opacityFrom: 0.4,
        opacityTo: 0.1,
        shadeIntensity: 1,
        stops: [0, 100],
        type: 'vertical',
    },
  },
  grid: {
    borderColor: '#55596e',
    yaxis: {
        lines: {
            show: true,
        },
    },
    xaxis: {
        lines: {
            show: true,
        },
    }
  },
  labels: ['Jan', 'Feb','Mar','Apr','May','Jun','Jul'],
  dataLabels: {
    enabled: false,
  },
  legend: {
    labels: {
        colors: '#f5f7ff',
    },
    show: true,
    position: 'top',
  },
  markers: {
    size: 6,
    strokeColors: '#1b2635', 
    strokeWidth: 3,
  },
  xaxis: {
    axisBorder: {
        color: '#55596e',
        show: true,
    },
    axisTicks: {
        color: '#55596e',
        show: true,
    },
    labels: {
        offSetY: 5,
        style: {
            colors: '#f5f7ff',
        },
    },
  },
  yaxis: [
    {
      title: {
        text: 'Purchase Orders',
        style: {
            color: '#f5f7ff',
        },
      },
      labels: {
        style: {
            colors: ['#f5f7ff'],
        },
      },
    },
    {
        opposite: true,
        title: {
            text: 'Sales Orders',
            style: {
                color: '#f5f7ff',
            },
        },
        labels: {
            style: {
                colors: ['#f5f7ff'],
            }
        }
    }
  ],
  tooltip: {
    shared: true,
    intersect: false,
    theme: 'dark',
  }
  };

  var areaChart = new ApexCharts(document.querySelector("#area-chart"), areaChartOptions);
  areaChart.render();