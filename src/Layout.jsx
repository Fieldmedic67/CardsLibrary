import { Outlet } from "react-router-dom";
import ProfileForm from "./pages/ProfileForm.jsx";
import React, {useState} from "react";

export function Layout() {

    return (
    <div> 
        <><Outlet /></>
</div>
)
}