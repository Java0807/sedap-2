import Head from "next/head";
import Image from "next/image";
import MainLayout from "@/components/common/layouts/MainLayout";
import useFetchApiItems from "@/hooks/useFetchApiItems";
import { useEffect } from "react";
import useCurrent from "@/hooks/useCurrentUser";

export default function Dashboard() {
  const user = useCurrent();
  // const [restaurants, isresLoading, refetchres] = useFetchApiItems(
  //   "/restaurants",
  //   {
  //     filters: {
  //       key: "users",
  //       users: {
  //         documentId: user?.documentId,
  //       },
  //     },
  //   }
  // );

  const foundRestaurant = user?.restaurant;

  const filtersTest = [
    {
      key: "[restaurant][documentId]",
      operator: "[$eqi]",
      value: foundRestaurant?.documentId,
      required: true,
    },
    {
      key: "[name]",
      operator: "[$containsi]",
      value: "hello",
      required: false,
    },
  ];

  const data1 = filtersTest
    .map((filter) => {
      return filter.key + filter.operator + "=" + filter.value;
    })
    .join("&");

  const [categories, isLoading, fetcher, realRefetch] = useFetchApiItems();

  useEffect(() => {
    if (foundRestaurant?.documentId) {
      realRefetch(
        `/categories?filters[restaurant][documentId][$eqi]=${foundRestaurant.documentId}`
      );
    }
  }, [foundRestaurant]);

  const handleCreateCategory = (res) => {
    if (res.documentId) {
      console.log("res", res);
      const values = {
        data: {
          name: "Burger",
          description: "Burger desc",
          internalName: "OlimjonRes_Burger",
          restaurant: res.documentId, // res.documentId
        },
      };

      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      };
      fetch("http://192.168.100.109:1337/api/categories", options)
        .then((response) => response.json())
        .then((res) => {
          console.log(res);
        })
        .catch((error) => console.error(error));
    }
  };

  const handleCreateType = (cats) => {
    const firstCat = cats[1] ?? null;
    if (firstCat) {
      const values = {
        data: {
          name: "ilik shorva",
          category: firstCat.documentId, // res.documentId
        },
      };

      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      };
      fetch("http://192.168.100.114:1337/api/types", options)
        .then((response) => response.json())
        .then((res) => {
          console.log(res);
        })
        .catch((error) => console.error(error));
    }
  };

  return (
    <>
      <Head />
      <div>
        <button onClick={() => handleCreateCategory(foundRestaurant)}>
          Create Category
        </button>
        <button onClick={() => handleCreateType(categories)}>
          Create type
        </button>
        <Image src="/dashboard.png" width={1460} height={1544} alt="back" />
      </div>
    </>
  );
}

Dashboard.getLayout = (pageProps) => (
  <MainLayout>
    <Dashboard {...pageProps} />
  </MainLayout>
);
