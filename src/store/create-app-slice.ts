import { buildCreateSlice, asyncThunkCreator } from "@reduxjs/toolkit";

export const CreateAppSlice = buildCreateSlice({
  creators: { asyncThunk: asyncThunkCreator },
});
