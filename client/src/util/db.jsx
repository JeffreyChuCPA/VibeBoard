import {
  QueryClient,
  QueryClientProvider as QueryClientProviderBase,
  useQuery,
} from "@tanstack/react-query";
import axios from 'axios'

// React Query client
const client = new QueryClient();
const API_BASE_URL = import.meta.env.VITE_BACKEND_API_URL_DEV

/**** USERS ****/

// Fetch user data
// Note: This is called automatically in `auth.jsx` and data is merged into `auth.user`
export function useUser(uid) {
  //Manage data fetching with React Query: https://react-query.tanstack.com/overview
  return useQuery({
    // Unique query key: https://react-query.tanstack.com/guides/query-keys
    queryKey: ["user", { uid }],
    // Query function that fetches data
    queryFn: () =>
      axios.get(`${API_BASE_URL}/user/${uid}`)
        .then(handle),
      // Only call query function if we have a `uid`
      enabled: !!uid,
  });
}

// Fetch user data (non-hook)
// Useful if you need to fetch data from outside of a component
export function getUser(uid) {
  return axios
    .get(`${API_BASE_URL}/user/${uid}`)
    .then(handle)
}

// Update an existing user
export async function updateUser(uid, data) {
  const response = await axios
    .put(`${API_BASE_URL}/user/${uid}`, data)
    .then(handle)
  // Invalidate and refetch queries that could have old data
  await client.invalidateQueries(["user", { uid }]);
  return response;
}

/**** KEYBOARDS ****/
// Get all keyboards by user id
export function useKeyboardByUser(owner_id) {
  return useQuery({
    queryKey: ["keyboard", { owner_id }],
    queryFn: () =>
      axios.get(`${API_BASE_URL}/keyboard_themes?owner=${owner_id}`)
        .then(handle),
      // supabase
      //   .from("keyboard_themes")
      //   .select(
      //     "id, theme_name, description, keyboard_size, keyboard_layout, platform, image_path",
      //   )
      //   .eq("owner", owner_id)
      //   .then(handle),
    enabled: !!owner_id,
  });
}

// Get a keyboard by theme id
export function useKeyboardByTheme(theme_id, withColors = false) {
  return useQuery({
    queryKey: ["keyboard", { theme_id }],
    queryFn: () =>
      axios.get(`${API_BASE_URL}/keyboard_themes/:${theme_id}${withColors ? '?withColors=true' : ''}`)
      .then(handle),
      // supabase
      //   .from("keyboard_themes")
      //   .select(
      //     `id, theme_name, description, key_cap_color, keyboard_color, keyboard_shape, keyboard_size, keyboard_layout, platform, image_path, owner${
      //       withColors
      //         ? ", keyboard_theme_keys ( key_id, key_label_color )"
      //         : ""
      //     }`,
      //   )
      //   .eq("id", theme_id)
      //   .then(handle),
    enabled: !!theme_id ,
  });
}

// Fetch a paginated list of keyboard themes
export function useKeyboardPaginated(page, size = 10) {
  const { from, to } = getPagination(page, size);
  return useQuery({
    queryKey: ["keyboards", page, size], 
    queryFn: () =>
      axios
        .get(`${API_BASE_URL}/keyboard_themes`, {
          params: { from, to }
        })
        .then(handle),
        enabled: !!page

    // supabase
    //   .from("keyboard_themes")
    //   .select(
    //     "id, theme_name, description, keyboard_size, keyboard_layout, platform, image_path",
    //   )
    //   .then(handle),
  });

  //!temp return
  // return []
}

export async function createKeyboardTheme(themeData, keyboardData) {
  const themeResponse = await axios
    .post(`${API_BASE_URL}/keyboard_themes/add`, themeData)
    .then(handle)

  const themeId = themeResponse.id
  const keyboardDataWithThemeId = keyboardData.map((kd) => ({
    ...kd,
    theme_id: themeId
  }))

  return await axios
    .post(`${API_BASE_URL}/keyboard_themes_keys`, keyboardDataWithThemeId)
    .then(handle)
  // const response = await supabase
  //   .from("keyboard_themes")
  //   .upsert(themeData, { onConflict: "theme_name" })
  //   .select()
  //   .then(handle);

  // const { id: themeId } = response[0];
  // const keyboardDataWithThemeId = keyboardData.map((kd) => ({
  //   ...kd,
  //   theme_id: themeId,
  // }));

  // return await supabase
  //   .from("keyboard_theme_keys")
  //   .upsert(keyboardDataWithThemeId)
  //   .then(handle);

  // Invalidate and refetch queries that could have old data
  // await client.invalidateQueries(["items"]);
}

export async function deleteItem(theme_id, owner_id) {
  const response = axios
    .delete(`${API_BASE_URL}/keyboard_themes/:${theme_id}`)
    .then(handle)
  // const response = await supabase
  //   .from("keyboard_themes")
  //   .delete()
  //   .eq("id", id)
  //   .then(handle);
  // Invalidate and refetch queries that could have old data
  await Promise.all([client.invalidateQueries(["keyboard", { owner_id }])]);
  return response;
}

/**** HELPERS ****/

// Get response data or throw error if there is one
function handle(response) {
  if (response.error) throw response.error;
  return response.data;
}

// React Query context provider that wraps our app
export function QueryClientProvider(props) {
  return (
    <QueryClientProviderBase client={client}>
      {props.children}
    </QueryClientProviderBase>
  );
}

// determine subset of items to fetch based on current page and specified size
//! to test if logic is correct for pagination of keyboards. Implementation of pagination is currently hard coded
const getPagination = (page, size) => {
  const limit = size ? +size : 3;
  const from = page ? page * limit : 0;
  const to = page ? from + size : size;

  return { from, to };
};
