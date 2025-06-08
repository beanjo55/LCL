import {
  createBrowserRouter,
  redirect,
  RouterProvider,
} from "react-router-dom";
import Chat from "./components/Chat/Chat";
import ToolsList from "./components/tools/ToolsList";

const router = createBrowserRouter([
  {
    path: "/",
    loader: () => redirect("/chat"),
  },
  {
    path: "/chat",
    element: <Chat />,
  },
  {
    path: "/tools",
    element: <ToolsList />,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
