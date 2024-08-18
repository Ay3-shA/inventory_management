"use client";
// Import necessary modules
import Image from "next/image";
import { useState, useEffect } from "react";
import { firestore } from "@/firebase";
import {
  Box,
  Modal,
  Stack,
  TextField,
  Typography,
  Button,
  Card,
  CardContent,
  CardActions,
  Grid,
} from "@mui/material";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  getDoc,
  setDoc,
} from "firebase/firestore";

export default function Home() {
  const [inventory, setinventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, "inventory"));
    const docs = await getDocs(snapshot);
    const inventoryList = [];
    docs.forEach((doc) => {
      inventoryList.push({
        name: doc.id,
        ...doc.data(),
      });
    });
    setinventory(inventoryList);
  };

  const addItem = async (item) => {
    const docRef = doc(collection(firestore, "inventory"), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      const quantity = Number(data?.quantity) || 0;
      await setDoc(docRef, { quantity: quantity + 1 });
    } else {
      await setDoc(docRef, { quantity: 1 });
    }

    await updateInventory();
  };

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, "inventory"), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      if (quantity == 1) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, { quantity: quantity - 1 });
      }
    }
    await updateInventory();
  };

  useEffect(() => {
    updateInventory();
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const filteredInventory = inventory.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box
      width="100vw"
      minHeight="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="flex-start"
      alignItems="center"
      gap={3}
      padding={3}
      className="bg-animated-gradient" // Apply the animated background class
    >
      <Typography variant="h2" color="#333333" marginBottom={2}>
        Pantry Inventory
      </Typography>

      <TextField
        variant="outlined"
        placeholder="Search items"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        fullWidth
        sx={{ maxWidth: 600, marginBottom: 3 }}
      />

      <Button
        variant="contained"
        color="primary"
        onClick={handleOpen}
        sx={{ marginBottom: 3 }}
      >
        Add New Item
      </Button>

      <Grid container spacing={3} justifyContent="center">
        {filteredInventory.map(({ name, quantity }) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={name}>
            <Card sx={{ minWidth: 275, bgcolor: getRandomColor() }}>
              <CardContent>
                <Typography
                  variant="h5"
                  component="div"
                  color="#333333"
                  gutterBottom
                >
                  {name.charAt(0).toUpperCase() + name.slice(1)}
                </Typography>
                <Typography variant="body2" color="#333333">
                  Quantity: {quantity}
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  size="small"
                  color="primary"
                  onClick={() => addItem(name)}
                >
                  Add
                </Button>
                <Button
                  size="small"
                  color="secondary"
                  onClick={() => removeItem(name)}
                >
                  Remove
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Modal open={open} onClose={handleClose}>
        <Box
          position="absolute"
          top="50%"
          left="50%"
          width={400}
          bgcolor="white"
          border="2px solid #000"
          boxShadow={24}
          p={4}
          display="flex"
          flexDirection="column"
          gap={3}
          sx={{
            transform: "translate(-50%, -50%)",
          }}
        >
          <Typography variant="h6">Add Item</Typography>
          <Stack width="100%" direction="row" spacing={2}>
            <TextField
              variant="outlined"
              fullWidth
              value={itemName}
              onChange={(e) => {
                setItemName(e.target.value);
              }}
            />
            <Button
              variant="outlined"
              onClick={() => {
                addItem(itemName);
                setItemName("");
                handleClose();
              }}
            >
              Add
            </Button>
          </Stack>
        </Box>
      </Modal>
    </Box>
  );
}

// Helper function to get a random color
const getRandomColor = () => {
  const colors = [
    "#FFB6C1", // Light Pink
    "#FFDEAD", // Navajo White
    "#FFE4B5", // Moccasin
    "#98FB98", // Pale Green
    "#87CEFA", // Light Sky Blue
    "#D8BFD8", // Thistle
    "#E6E6FA", // Lavender
    "#F5F5DC", // Beige
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};


