declare module "react-redux" {
  import { Component, DependencyList } from "react";
  import { Action, AnyAction, Dispatch, Store } from "redux";

  export function useDispatch(): Dispatch<any>;
  export function useSelector<TResult, TState = any>(
    mapState: (state: TState) => TResult,
    deps: DependencyList | undefined
  ): TResult;

  export function batch(cb: () => void): void;

  export interface ProviderProps<A extends Action = AnyAction> {
    /**
     * The single Redux store in your application.
     */
    store: Store<any, A>;
  }

  export class Provider<A extends Action = AnyAction> extends Component<
    ProviderProps<A>
  > {}
}
