export default function Loading() {
  // You can add any UI inside Loading, including a Skeleton.
  const posts = [1, 2, 3, 4, 5];
  return (
    <div>
      {posts &&
        posts.map((el) => {
          return (
            <div key={el}>
              <div className="border-solid border-primary rounded-lg border my-4 p-4">
                <div className="skeleton-container">
                  <div className="border-solid border-primary rounded-lg border my-4 p-4">
                    <div className="skeleton-content animate-pulse">
                      {/* Skeleton loading lines */}
                      <div className="skeleton-line w-2/3 h-4 mb-2 bg-gray-300 animate-pulse"></div>
                      <div className="skeleton-line w-3/4 h-4 mb-2 bg-gray-300 animate-pulse"></div>
                      <div className="skeleton-line w-1/2 h-4 mb-2 bg-gray-300 animate-pulse"></div>
                      {/* Replace EditPost with your component */}
                      {/* <EditPost /> */}
                    </div>
                  </div>
                </div>{" "}
                <div className="skeleton-loading"></div>
              </div>
            </div>
          );
        })}
    </div>
  );
}
