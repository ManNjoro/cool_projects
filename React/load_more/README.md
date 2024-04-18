# Load More Data Component

This is a React component that fetches and displays products from a JSON API. It allows the user to load more products by clicking a button, up to a maximum of 100 products.

## Component Structure

The component uses the useState and useEffect hooks from React, and the axios library for making HTTP requests.

`loading`: A state variable that tracks whether data is currently being loaded.
products: A state variable that stores the list of products fetched from the API.
count: A state variable that tracks the number of times the user has clicked the `Load More Products` button.
disableButton: A state variable that tracks whether the `Load More Products` button should be disabled.
Functions
`fetchProducts`: An asynchronous function that fetches products from the API and updates the products state variable.
useEffect: A React hook that runs the fetchProducts function whenever the count state variable changes.

## Rendering

The component renders a loading message while data is being fetched, and a list of products once they have been fetched. It also renders a `Load More Products` button that allows the user to fetch more products, up to a maximum of 100. Once 100 products have been fetched, the button is disabled and a message is displayed to the user.
