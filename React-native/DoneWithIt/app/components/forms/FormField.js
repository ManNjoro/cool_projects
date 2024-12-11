import { StyleSheet, Text, View } from "react-native";
import React from "react";
import AppTextInput from "../AppTextInput";
import ErrorMessage from "./ErrorMessage";
import { useFormikContext } from "formik";

export default function FormField({ name,width, ...otherProps }) {
  const { errors, handleBlur, setFieldValue, touched, values } = useFormikContext();
  return (
    <>
      <AppTextInput
        onBlur={() => handleBlur(name)}
        onChangeText={text => setFieldValue(name, text)}
        value={values[name]}
        width={width}
        {...otherProps}
      />
      <ErrorMessage error={errors[name]} visible={touched[name]} />
    </>
  );
}

const styles = StyleSheet.create({});
