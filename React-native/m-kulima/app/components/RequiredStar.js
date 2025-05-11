import { StyleSheet, Text } from 'react-native'

const RequiredStar = () => {
  return (
      <Text style={styles.star}>*</Text>
  )
}

export default RequiredStar

const styles = StyleSheet.create({
    star: {
        color: 'red',
        fontWeight:"bold",
    }
})