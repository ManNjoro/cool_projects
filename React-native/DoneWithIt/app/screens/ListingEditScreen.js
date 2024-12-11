import { StyleSheet } from "react-native";
import * as Yup from "yup";
import Screen from "../components/Screen";
import { AppForm, FormField, SubmitButton } from "../components/forms";
import FormPicker from "../components/forms/FormPicker";
import FormImagePicker from "../components/forms/FormImagePicker";
import listingsApi from '../api/listings'

import { useEffect, useState } from "react";
import CategoryPickerItem from "../components/CategoryPickerItem";
import useLocation from "../hooks/useLocation";
import UploadScreen from "./UploadScreen";

const validationSchema = Yup.object().shape({
  title: Yup.string().required().min(1).label("Title"),
  price: Yup.number().required().min(1).max(10000).label("Price"),
  description: Yup.string().label("Description"),
  category: Yup.object().required().nullable().label("Category"),
  images: Yup.array().min(1, "Please select at least one image"),
});

const categories = [
  { label: "Furniture", value: 1, backgroundColor: "red", icon: "floor-lamp" },
  { label: "Cars", value: 2, backgroundColor: "orange", icon: "car" },
  { label: "Cameras", value: 3, backgroundColor: "gold", icon: "camera" },
  { label: "Games", value: 4, backgroundColor: "green", icon: "gamepad" },
  { label: "Clothing", value: 5, backgroundColor: "orange", icon: "shoe-heel" },
  { label: "Sports", value: 6, backgroundColor: "blue", icon: "volleyball" },
  {
    label: "Movies & Music",
    value: 7,
    backgroundColor: "blue",
    icon: "headphones",
  },
  {
    label: "Books",
    value: 8,
    backgroundColor: "indigo",
    icon: "book-open-blank-variant",
  },
  { label: "Others", value: 9, backgroundColor: "gray", icon: "lock" },
];

export default function ListingEditScreen() {
  const location = useLocation()
  const [uploadVisible, setUploadVisible] = useState(false)
  const [progress, setProgress] = useState(0)

  const handleSubmit = async (listing, {resetForm}) => {
    setProgress(0)
    setUploadVisible(true)
    const result = await listingsApi.addListing({...listing,location},
      (progress) => setProgress(progress)
    )

    if (!result.ok) {
      setUploadVisible(false)
      return alert('Could not save the listing')}
    resetForm()
  }
  return (
    <Screen style={styles.container}>
      <UploadScreen onDone={() => setUploadVisible(false)} progress={progress} visible={uploadVisible} />
      <AppForm
        initialValues={{
          title: "",
          price: "",
          description: "",
          category: null,
          images: [],
        }}
        onSubmit={handleSubmit}
        validationSchema={validationSchema}
      >
        <FormImagePicker name="images" />
        <FormField maxLength={255} name="title" placeholder="Title" />
        <FormField
          keyboardType="numeric"
          maxLength={8}
          name="price"
          placeholder="Price"
          width={120}
        />
        <FormPicker
          items={categories}
          name="category"
          numberOfColumns={3}
          PickerItemComponent={CategoryPickerItem}
          placeholder="Category"
          width="50%"
        />
        <FormField
          maxLength={255}
          multiline
          numberOfLines={3}
          name="description"
          placeholder="Description"
        />
        <SubmitButton title="Post" />
      </AppForm>
    </Screen>
  );
}

const styles = StyleSheet.create({});
