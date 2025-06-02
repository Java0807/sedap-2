import React, { useEffect, useState } from "react";
import {
  Box,
  TextField,
  Button,
  IconButton,
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import useCurrentUser from "@/hooks/useCurrentUser";
import useCategory from "@/hooks/useCategories";

export default function CategoryForm({
  onCreate,
  onRefetch,
  category,
  onUpdate,
  onCancel,
}) {
  const [form, setForm] = useState({
    documentId: null,
    name: "",
    description: "",
  });
  const [editCancel, setEditCancel] = useState(null);

  const handleCancel = (e) => {
    e.preventDefault();
    if (form.documentId) {
      setForm({
        documentId: null,
        name: "",
        description: "",
      });
    }
  };

  useEffect(() => {
    if (category) {
      setForm({
        documentId: category.documentId,
        name: category.name,
        description: category.description,
      });
    }
  }, [category]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(form);
    if (form.documentId) {
      onUpdate(form);
    } else {
      onCreate(form);
    }
    setForm({
      documentId: null,
      name: "",
      description: "",
    });
  };
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  return (
    <form onSubmit={handleSubmit}>
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
          <TextField
            label="Category nomi"
            name="name"
            value={form.name}
            onChange={handleChange}
            sx={{ flexGrow: 1, minWidth: 200 }}
            disabled={loading}
          />
          <TextField
            label="Category ta'rifi"
            name="description"
            value={form.description}
            onChange={handleChange}
            sx={{ flexGrow: 2, minWidth: 300 }}
            disabled={loading}
          />
        </Box>

        {error && <Box sx={{ color: "error.main", mb: 1 }}>{error}</Box>}

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Button
            variant="contained"
            color={form.documentId ? "warning" : "primary"}
            type="submit"
            disabled={loading}
            sx={{ minWidth: 120 }}
          >
            {form.documentId ? "update" : "create"}
          </Button>

          {form.documentId && (
            <IconButton color="error" onClick={handleCancel} disabled={loading}>
              <CloseIcon />
            </IconButton>
          )}
        </Box>
      </Box>
    </form>
  );
}
