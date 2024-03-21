import React, { createContext, useContext, useReducer, ReactNode } from "react";

//carouselImgNo is in context because if ad image is deleted in editAd,
//in ad image carousel the first image will automatically be displayed,
//this avoids the problem if for example the 5th image is deleted then we will get an error
//because now the 5th image in the array no longer exists

interface AppState {
  number: number;
}

type AppActions = { type: "SET_IMG_NO"; payload: number };

const initialState: AppState = {
  number: 0,
};

const CarouselImgContext = createContext<
  | {
      carouselImgState: AppState;
      carouselImgDispatch: React.Dispatch<AppActions>;
    }
  | undefined
>(undefined);

const appReducer = (state: AppState, action: AppActions): AppState => {
  switch (action.type) {
    case "SET_IMG_NO":
      return { number: action.payload };
    default:
      return state;
  }
};

export const CarouselImgProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [carouselImgState, carouselImgDispatch] = useReducer(
    appReducer,
    initialState
  );

  return (
    <CarouselImgContext.Provider
      value={{ carouselImgState, carouselImgDispatch }}
    >
      {children}
    </CarouselImgContext.Provider>
  );
};

export const useCarouselImgContext = () => {
  const context = useContext(CarouselImgContext);
  if (!context) {
    throw new Error("Something went wrong.");
  }
  return context;
};
