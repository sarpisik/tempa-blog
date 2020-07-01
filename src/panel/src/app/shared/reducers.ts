import { AsyncState } from './types';
import { PayloadAction } from '@reduxjs/toolkit';

export function asyncStart<State extends AsyncState>(state: State) {
    state.loading = true;
    state.error = null;
}

export function asyncFailed<State extends AsyncState>(
    state: State,
    action: PayloadAction<string>
) {
    state.loading = false;
    state.error = action.payload;
}
