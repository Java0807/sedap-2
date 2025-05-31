import { useEffect, useState } from "react";
import { axiosInstance } from "@/utils/axiosInstance";
import useCurrentUser from "./useCurrentUser";

const ROOT_PATH = "/categories";

export default function useCategory() {
  const [isLoading, setIsLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);
  const user = useCurrentUser();

  useEffect(() => {
    if (user?.restaurantId) {
      reFetch();
    }
  }, [user]);

  const reFetch = () => {
    setIsLoading(true);
    axiosInstance
      .get(
        `${ROOT_PATH}?filters[restaurant][documentId][$eq]=${user.restaurantId}`
      )
      .then((res) => setCategories(res.data.data))
      .catch((err) => {
        console.error("Kategoriya olishda xatolik:", err);
        setError(err);
      })
      .finally(() => setIsLoading(false));
  };

  const createCategory = (data) => {
    if (!user?.restaurantId) {
      console.error("restaurantId topilmadi");
      return;
    }

    const values = {
      data: {
        name: data.name,
        description: data.description,
        internalName: `Asliddin_${data.name}`,
        restaurant: user.restaurantId,
      },
    };

    axiosInstance
      .post(ROOT_PATH, values)
      .then((res) => {
        console.log("Kategoriya yaratildi:", res.data.data);
        reFetch();
      })
      .catch((error) => {
        console.error("Kategoriya yaratishda xatolik:", error);
        setError(error);
      });
  };

  const getCategory = async (documentId) => {
    try {
      const res = await axiosInstance.get(`${ROOT_PATH}/${documentId}`);
      return res.data.data;
    } catch (error) {
      console.error("Kategoriya olishda xatolik:", error);
      setError(error);
      return null;
    }
  };

  const updateCategory = async (data) => {
    if (!data?.documentId) {
      console.error("documentId topilmadi");
      return;
    }

    const values = {
      data: {
        name: data.name,
        description: data.description,
        internalName: `${data.name}Res`,
        restaurant: data.restaurantId || user?.restaurantId,
      },
    };

    axiosInstance
      .patch(`${ROOT_PATH}/${data.documentId}`, values)
      .then((res) => {
        console.log("Kategoriya yangilandi:", res.data);
        reFetch();
      })
      .catch((error) => {
        console.error("Kategoriya yangilashda xatolik:", error);
        setError(error);
      });
  };

  const deleteCategory = async (documentId) => {
    axiosInstance
      .delete(`${ROOT_PATH}/${documentId}`)
      .then((res) => {
        console.log("Kategoriya o‘chirildi:", res.data);
        reFetch();
      })
      .catch((err) => {
        console.error("Kategoriya o‘chirishda xatolik:", err);
        setError(err);
      });
  };

  return [
    {
      categories,
      isLoading,
      error,
      reFetch,
    },
    {
      getCategory,
      createCategory,
      updateCategory,
      deleteCategory,
    },
  ];
}
