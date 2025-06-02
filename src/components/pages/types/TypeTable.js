import React, { useEffect, useState } from "react";
import CustomBtnFood from "@/components/pages/foods/CustomBtnFood";
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
} from "@mui/material";
import CategoryDialog from "../categories/Dialog";

export default function TypeTable({
  types,
  onDelete,
  onRefetch,
  onUpdate,
  setEditType,
}) {
  const [dialogState, setDialogState] = useState({
    open: false,
    categoryId: null,
  });

  const handleEdit = (type) => {
    setEditType(type);
    console.log("categori table", type);
  };

  return (
    <>
      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Types</TableCell>
              <TableCell>Categories</TableCell>
              <TableCell
                sx={{ textAlign: "end", paddingRight: "40px" }}
                colSpan={2}
              >
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {types.length > 0 ? (
              types.map((type) => (
                <TableRow key={type.id}>
                  <TableCell>{type.id}</TableCell>
                  <TableCell>{type.name || "-"}</TableCell>
                  <TableCell>{type.category?.name || "-"}</TableCell>
                  <TableCell
                    sx={{ display: "flex", gap: "20px", justifyContent: "end" }}
                  >
                    <CustomBtnFood
                      onClick={() => handleEdit(type)}
                      back="#FF5B5B26"
                      img="/foodIcon2.png"
                      text="Edit"
                    />
                    <CustomBtnFood
                      onClick={() =>
                        setDialogState({
                          open: true,
                          categoryId: type.documentId,
                        })
                      }
                      back="#2D9CDB26"
                      img="/foodIcon3.png"
                      text="Delete"
                    />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  Hech qanday category topilmadi
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Paper>
      <CategoryDialog
        isOpen={dialogState.open}
        onConfirm={() => onDelete(dialogState.categoryId)}
        onClose={() => {
          setDialogState({
            open: false,
            categoryId: null,
          });
        }}
        onRefetch={onRefetch}
      />
    </>
  );
}
