import { useQueryClient } from '@tanstack/react-query';
import { getQueryKey } from '@trpc/react-query';
import './App.css';
import reactLogo from './assets/react.svg';
import { trpc } from './lib/trpc';
import viteLogo from '/vite.svg';

function App() {
  const queryClient = useQueryClient();
  const { data, isLoading } = trpc.getUser.useQuery("Vite");

  const {data: stores, isLoading: isStoresLoading} = trpc.getStores.useQuery()

  const storesKey = getQueryKey(trpc.getStores, undefined, "query")

  const createStore = trpc.createStore.useMutation({
    onSuccess(data, variables, context) {
      queryClient.setQueryData(storesKey, (oldData) => {
        if(!oldData) return []
        return [data, ...oldData]
      })
    },
  })


  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>
        {isLoading ? (
          'Loading'
        ) : (
          <>
            {' '}
            {data?.id} + {data?.name}
          </>
        )}
      </h1>
      <div className="card">
        <button onClick={() => createStore.mutate({
          name: "Vite",
        })}>
         {createStore.isPending ? 'Creating' : 'Create'} 
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <ul>
        {isStoresLoading && <li>Loading stores...</li>}
        {stores?.map((store) => (
          <li key={store.id}>{store.id} - {store.name}</li>
        ))}
      </ul>
    </>
  );
}

export default App;
