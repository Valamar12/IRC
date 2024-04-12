import { Outlet } from "react-router-dom";
import './App.css';
import ChannelHeader from "./components/ChannelHeader";
import InputForm from "./components/InputForm";
import ListChannel from "./components/ListChannel";
import UserList from "./components/UserList";

function App(){

  return (
    <>
      <UserList />
      <ListChannel />
      <div className="main">
        <ChannelHeader></ChannelHeader>
        <Outlet />
        <InputForm></InputForm>
      </div>
    </>
  )
}

export default App