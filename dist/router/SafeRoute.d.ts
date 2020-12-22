export default SafeRoute;
declare function SafeRoute({ exact, path, render, component: Component, roles }: {
    exact: any;
    path: any;
    render: any;
    component: any;
    roles: any;
}): any;
declare namespace SafeRoute {
    export namespace propTypes {
        export const exact: any;
        export const path: any;
        export function render(props: any): any;
        export const component: any;
        export const roles: any;
    }
}
