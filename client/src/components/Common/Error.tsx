interface ErrorProps {
  error?: string | null;
  isLoading?: boolean;
  fetchMoreData: () => void;
}

const Error = ({ error, isLoading, fetchMoreData }: ErrorProps) => {
  if (!error || isLoading) return null;

  return (
    <>
      <div className="bg-red-500 text-white p-4 mb-4 rounded">{error}</div>
      <div className="flex justify-center items-center">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-3 rounded shadow-lg focus:outline-none focus:shadow-outline-blue active:bg-blue-800"
          onClick={fetchMoreData}
        >
          Refresh
        </button>
      </div>
    </>
  );
};

export default Error;
