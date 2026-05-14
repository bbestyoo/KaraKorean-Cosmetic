export default function Page() {
  return (
    <>
      {/* Spacer to allow scrolling */}
    <div className="h-screen"></div>
      <div className="grid relative grid-cols-2">
        {/* Left Column */}
        <div className="flex justify-center items-start p-16">
          {/* 1. 'mt-96' sets the initial starting position.
            2. 'sticky top-24' tells it where to stop when scrolling.
          */}
          <div className="sticky top-72 flex flex-col font-bold text-5xl">
            <div>Our</div>
            <div>Core</div>
            <div>Values</div>
          </div>
        </div>

        {/* Right Column (Long Content) */}
        <div className="text-2xl font-bold mt-12 p-16 space-y-12">
          <div>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Reiciendis,
            enim at, laborum nemo, aliquid quae iste nostrum ipsa beatae sunt
            modi. Nihil distinctio repellendus accusamus consequuntur!
          </div>
          {/* ... Add more text here to ensure the page is long enough ... */}
          <div className="h-[2000px]">Scrolling content...</div>
        </div>
      </div>
    </>
  );
}