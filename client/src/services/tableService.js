import api from "./api"

// CREATE TABLE
export const createTable =
  async (tableData) => {
    const response =
      await api.post(
        "/tables",
        tableData
      )

    return response.data
  }

// GET TABLES
export const getTables =
  async () => {
    const response =
      await api.get("/tables")

    return response.data
  }

// UPDATE STATUS
export const updateTableStatus =
  async (
    id,
    status
  ) => {
    const response =
      await api.put(
        `/tables/${id}`,
        { status }
      )

    return response.data
  }

// DELETE TABLE
export const deleteTable =
  async (id) => {
    const response =
      await api.delete(
        `/tables/${id}`
      )

    return response.data
  }