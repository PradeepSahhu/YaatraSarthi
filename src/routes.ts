import React from "react";

const modules = import.meta.glob<{default: React.ComponentType<any>}>("./pages/**/*.tsx");

function wrapWithLayout(Component: any, Layout: any){
    return React.createElement(
        React.Suspense,
        {fallback: React.createElement("div", null)},
        Layout ? React.createElement(Layout, null, React.createElement(Component)) : React.createElement(Component)
    );
}

const routes = Object.keys(modules).map((path)=>{
    const routePath = path
        .replace("./pages", "")
        .replace(/\/index\.tsx$/, "/")
        .replace(/\.tsx$/, "")
        .replace(/\[([^\]]+)\]/g, ":$1");

    const layoutPath = path.split("/").slice(0, -1).join("/") + "/_layout.tsx";
    const Layout = modules[layoutPath] ? React.lazy(modules[layoutPath]) : null;

    const Component = React.lazy(modules[path]);

    return {
        path: routePath === "" ? "/" : routePath,
        element: wrapWithLayout(Component, Layout),
    };
});

export default routes;