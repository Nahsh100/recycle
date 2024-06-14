import {
    atom,
  } from 'recoil';
  import { recoilPersist } from 'recoil-persist'
import { userProps } from './pages/DashboardLayout';
import { productProps } from './pages/AddProduct';

const { persistAtom } = recoilPersist()

  type userType = {
    email: string
  }

  export const userState = atom({
    key: 'userState', // unique ID (with respect to other atoms/selectors)
    default: {}, // default value (aka initial value)
    effects_UNSTABLE: [persistAtom],
  });

  export const loggedInUserState = atom<userProps[]>({
    key: 'loggedInUserState', // unique ID (with respect to other atoms/selectors)
    default: [], // default value (aka initial value)
    effects_UNSTABLE: [persistAtom],
  });

  export const productsState = atom<productProps[]>({
    key: 'productsState', // unique ID (with respect to other atoms/selectors)
    default: [], // default value (aka initial value)
  });