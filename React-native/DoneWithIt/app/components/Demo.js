import { Button, StyleSheet } from "react-native";
import NetInfo, {useNetInfo} from '@react-native-community/netinfo'

export default function Demo() {
  const netInfo = useNetInfo()
  return (
    <Button disabled={!netInfo.isInternetReachable} title="Switch" />
  );
}

const styles = StyleSheet.create({
  
});
