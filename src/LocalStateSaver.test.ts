import LocalStateSaver from './LocalStateSaver';
import {UserState, AppOptionEntry} from './UserState';
import { AppOptions } from './AppOption';

beforeAll(() => {
  const localStorageMock = (function () {
    const store = new Map<string, string>();
    return {
      getItem: function (key: string) {
        return store.get(key);
      },
      setItem: function (key: string, value: string) {
        store.set(key, value);
      },
      clear: function () {
        store.clear();
      }
    };
  })();
  Object.defineProperty(window, 'localStorage', { value: localStorageMock });
});


test('Saves AppOptions correctly', async () => {
  const saver = new LocalStateSaver();
  const testState = {
    entries: new Map<String, AppOptionEntry>()
  } as UserState;
  const testOptions = AppOptions.create().addOption("WACCA");
  testState.entries.set("test1", {
    name: "test1",
    options: testOptions
  });

  expect(testState.entries.size).toBe(1);
  await saver.save(testState);
  const loadedState = await saver.load();
  expect(loadedState.entries.size).toBe(1);
  const entry = loadedState.entries.get("test1");
  expect(entry).not.toBeUndefined();
  expect(entry).not.toBeNull();
  expect(entry?.name).toBe("test1");
  const options = entry?.options.getAll();
  expect(options).not.toBeUndefined();
  expect(options?.length).toBe(1);
  expect(options?.pop()?.value).toBe("WACCA");
});

