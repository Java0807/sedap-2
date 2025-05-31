import React, { useEffect, useState } from "react";
import MainLayout from "@/components/common/layouts/MainLayout";
import {
  Typography,
  Box,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import TypeTable from "@/components/pages/types/TypeTable";
import axios from "axios";
import useCurrent from "@/hooks/useCurrentUser";
import useFetchApiItems from "@/hooks/useFetchApiItems";
import CustomBtnFood from "@/components/pages/foods/CustomBtnFood";
import TypeForm from "@/components/pages/types/TypeForm";

export default function TypePage() {
  const user = useCurrent();
  const [foundRestaurant, setFoundRestaurant] = useState(null);

  const [dialogState, setDialogState] = useState({
    open: false,
    categoryId: null,
  });

  const handleDelete = async (typeId) => {
    if (!typeId) return;

    try {
      const res = await axios.delete(
        `http://192.168.100.114:1337/api/types/${typeId}`
      );
      console.log("Deleted:", res.data);
      setDialogState({ open: false, categoryId: null });
      refetchCategories();
    } catch (error) {
      console.error("Xatolik:", error);
    }
  };

  const [categories, isLoading, refetchCategories] = useFetchApiItems(
    foundRestaurant
      ? `/categories?filters[restaurant][documentId][$eq]=${foundRestaurant.documentId}`
      : null
  );

  const [editCategory, setEditCategory] = useState(null);

  function cancelEdit() {
    setEditCategory(null);
  }

  useEffect(() => {
    if (user?.restaurants?.length > 0) {
      setFoundRestaurant(user.restaurants[0]);
    }
  }, [user]);

  return (
    <Box sx={{ maxWidth: 900, mx: "auto", mt: 4 }}>
      <Typography variant="h4" mb={3}>
        {foundRestaurant?.name} restoranining Categories
      </Typography>

      <TypeForm
        editCategory={editCategory}
        onCancel={cancelEdit}
        foundRestaurant={foundRestaurant}
        cat={categories}
      />
      <TypeTable />

      <Dialog
        open={dialogState.open}
        onClose={() => setDialogState({ open: false, categoryId: null })}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Are you sure?</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Do you want to delete?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setDialogState({ open: false, categoryId: null })}
          >
            Cancel
          </Button>
          <Button
            onClick={() => handleDelete(dialogState.categoryId)}
            autoFocus
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

TypePage.getLayout = (pageProps) => (
  <MainLayout>
    <TypePage {...pageProps} />
  </MainLayout>
);
