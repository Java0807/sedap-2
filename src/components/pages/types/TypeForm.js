import React, { useEffect, useState } from "react";
import {
  Box,
  TextField,
  Button,
  Select,
  IconButton,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

export default function TypeForm({
  editCategory,
  onCancel,
  foundRestaurant,
  onSuccess,
  refetchCategories,
  cat,
}) {
  const [form, setForm] = useState({
    documentId: null,
    name: "",
    description: "",
  });
  const [category, setCategory] = useState(cat);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (editCategory) {
      setForm({
        documentId: editCategory.documentId || null,
        name: editCategory.name || "",
        description: editCategory.description || "",
      });
    } else {
      setForm({
        documentId: null,
        name: "",
        description: "",
      });
    }
  }, [editCategory]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (!form.name.trim()) {
      setError("Category nomi kerak");
      return false;
    }
    if (!foundRestaurant) {
      setError("Restoran topilmadi");
      return false;
    }
    return true;
  };

  const saveCategory = async () => {
    if (!validateForm()) return;

    setLoading(true);
    setError(null);

    const payload = {
      data: {
        name: form.name.trim(),
        description: form.description.trim(),
        internalName: `${foundRestaurant.name}_${form.name}`.replace(
          /\s+/g,
          ""
        ),
        restaurant: foundRestaurant.documentId,
      },
    };

    const url = form.documentId
      ? `http://192.168.100.114:1337/api/types/${form.documentId}`
      : `http://192.168.100.114:1337/api/types`;

    const method = form.documentId ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error?.message || "Category saqlashda xatolik yuz berdi"
        );
      }

      setForm({ documentId: null, name: "", description: "" });
      if (onSuccess) onSuccess(data);
      if (refetchCategories) refetchCategories();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ mb: 4 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
        <TextField
          label="Type Name"
          name="name"
          value={form?.name}
          onChange={handleChange}
          sx={{ flexGrow: 1, minWidth: 200 }}
          disabled={loading}
        />
        <FormControl sx={{ flexGrow: 1, minWidth: 200 }}>
          <InputLabel id="demo-simple-select-label">Category</InputLabel>
          <Select
            sx={{ flexGrow: 1, minWidth: 200 }}
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={category}
            label="Category"
            onChange={(e) => setCategory(e.target.value)}
          >
            {cat.map((cat) => (
              <MenuItem key={cat.id} value={cat.documentId}>
                {cat.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {error && <Box sx={{ color: "error.main", mb: 1 }}>{error}</Box>}

      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Button
          variant="contained"
          color={form.documentId ? "warning" : "primary"}
          onClick={saveCategory}
          disabled={loading}
          sx={{ minWidth: 120 }}
        >
          {loading ? (
            <CircularProgress size={24} color="inherit" />
          ) : form.documentId ? (
            "Yangilash"
          ) : (
            "Qo'shish"
          )}
        </Button>

        {form.documentId && (
          <IconButton color="error" onClick={onCancel} disabled={loading}>
            <CloseIcon />
          </IconButton>
        )}
      </Box>
    </Box>
  );
}
