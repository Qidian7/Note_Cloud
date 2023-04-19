//1 本地存储，存储所有内容的地方
import { useEffect, useState } from "react";

export function useLocalStorage<T>(key: string, initiaValue: T | (() => T)) {
  const [value, setValue] = useState<T>(() => {
    const jsonValue = localStorage.getItem(key);
    //1  检查该值是否存在
    if (jsonValue == null) {
      if (typeof initiaValue === "function") {
        return (initiaValue as () => T)();
      } else {
        return initiaValue;
      }
    } else {
      return JSON.parse(jsonValue);
    }
  });
  //1 每次只是在value和key更新是工作
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [value, key]);
  return [value, setValue] as [T, typeof setValue];
}
