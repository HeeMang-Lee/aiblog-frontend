'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'dark',
  toggleTheme: () => {},
});

const STORAGE_KEY = 'theme';
/** localStorage 의 `storage` 이벤트는 같은 탭에서는 안 뜬다. 토글이 직접 알린다. */
const CHANGE_EVENT = 'theme-change';

/* localStorage 는 React 밖의 저장소다. 예전에는 effect 안에서 읽어 setState 로
   옮겼는데, 그러면 첫 렌더 직후 한 번 더 렌더가 돌고 lint 도 이걸 막는다.
   useSyncExternalStore 로 구독하면 중간 상태 없이 저장소를 곧바로 읽는다.

   subscribe 와 스냅샷 함수는 모듈 스코프에 둔다. 렌더마다 새 함수를 넘기면
   React 가 매번 다시 구독한다. */

function subscribe(onChange: () => void) {
  window.addEventListener('storage', onChange);
  window.addEventListener(CHANGE_EVENT, onChange);
  return () => {
    window.removeEventListener('storage', onChange);
    window.removeEventListener(CHANGE_EVENT, onChange);
  };
}

function readTheme(): Theme {
  return localStorage.getItem(STORAGE_KEY) === 'light' ? 'light' : 'dark';
}

/** 서버에는 localStorage 가 없다. 다크가 이 디자인의 기본 상태이므로 그걸 그린다. */
function serverTheme(): Theme {
  return 'dark';
}

/**
 * Dark is the home state for this design, so it is the default when nothing
 * is stored. Light is the same shell in a light editor theme.
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  const theme = useSyncExternalStore(subscribe, readTheme, serverTheme);

  // 여기는 setState 가 없다. React 상태를 바깥(문서 클래스)에 반영하는
  // 일이라 effect 가 맞는 자리다.
  useEffect(() => {
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    localStorage.setItem(STORAGE_KEY, readTheme() === 'dark' ? 'light' : 'dark');
    window.dispatchEvent(new Event(CHANGE_EVENT));
  }, []);

  const value = useMemo(() => ({ theme, toggleTheme }), [theme, toggleTheme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  return useContext(ThemeContext);
}
