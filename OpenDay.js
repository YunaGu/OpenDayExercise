document.addEventListener("DOMContentLoaded",function(){
  let ascending = false;
  const sortButton = document.createElement("Button");
  sortButton.textContent = "Sort Topics";
  sortButton.id = "sortButton";
  sortButton.classList.add("border-2", "p-1", "rounded-lg", "text-center","w-fit");

  const header = document.querySelector(".OpenDay");
  const title = document.createElement("div");
  title.classList.add("flex","flex-col","items-center","gap-4", "p-4");

  const searchInput = document.createElement("input");
  searchInput.type = "text";
  searchInput.placeholder = "Search...";
  searchInput.classList.add("border", "border-gray-300", "p-1", "rounded","w-1/4");

  sortButton.addEventListener("click", function(){
    populate();
  })

  searchInput.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      ascending = !ascending; // in case every time it changes order
      populate();
  }
  });


async function populate() {
  //   const requestURL = "./OpenDay.json";
  //   const request = new Request(requestURL);

  //   const response = await fetch(request);
  //   const topics = await response.json();

  //   populateTopics(topics);
  fetch("./OpenDay.json")
    .then((response) => response.json())
    .then((data) => {
      //   console.log(data);
      if(ascending) {
        data.topics.sort((a, b) => b.id - a.id);
      }else{
        data.topics.sort((a, b) => a.id - b.id);
      }
      populateTopics(data);
      ascending = !ascending;
    })
    .catch((error) => console.error("Error fetching JSON:", error));
}

function populateTopics(obj) {
  header.innerHTML = ""; // Clear existing content
  // console.log(header);
  const myH1 = document.createElement("h1");
  myH1.classList.add("text-center");
  myH1.id = `${obj.id}`;
  myH1.textContent = obj.description;
  // console.log(obj.description);
  const myH2 = document.createElement("h2");
  myH2.classList.add("text-lg", "text-gray-700", "font-medium", "text-center");
  myH2.textContent = "Start from " + obj.start_time + " to " + obj.end_time;
  title.appendChild(myH1);
  title.appendChild(myH2);
  title.appendChild(sortButton);
  title.appendChild(searchInput);
  header.appendChild(title);

  const searchTerm = searchInput.value.toLowerCase().trim();
  const filteredTopics = obj.topics.filter(
    (topic) =>
      topic.name.toLowerCase().includes(searchTerm) ||
      topic.description.toLowerCase().includes(searchTerm) ||
      topic.programs.some(program =>
        program.title.toLowerCase().includes(searchTerm) ||
        program.description.toLowerCase().includes(searchTerm) ||
        program.description_short.toLowerCase().includes(searchTerm)
    )
  );
  // console.log(filteredTopics);
  // console.log(obj.topics);
  filteredTopics.forEach((topic) => {
    const topicsContainer = document.createElement("div");
    topicsContainer.classList.add("topicsContainer");
    topicsContainer.id = `${topic.id}`;

    const topicDetailsContainer = document.createElement("div");
    topicDetailsContainer.classList.add(
      "relative",
      "w-full",
      "h-60",
      "border-2",
      "text-center"
      //   "bg-fixed"
    );
    topicDetailsContainer.style.backgroundImage = `url('${topic.cover_image}')`;
    topicDetailsContainer.style.backgroundSize = "cover";
    topicDetailsContainer.style.backgroundPosition = "center";
    topicDetailsContainer.style.backgroundRepeat = "no-repeat";
    // const topicCoverImage = document.createElement("img");
    // topicCoverImage.src = `${topic.cover_image}`;
    // topicCoverImage.classList.add("w-[100px]", "h-[50px]");

    const topicContainerText = document.createElement("div");
    topicContainerText.classList.add(
      "text-center",
      "absolute",
      "inset-x-1/2",
      "top-1/2",
      "transform",
      "-translate-x-1/2",
      "-translate-y-1/2",
      "w-full"
    );

    // Highlighting matched words
    function highlightMatchedWords(text, term) {
      if (!term || term.trim() === "") {
        let highlightedText = document.createElement("span");
        highlightedText.innerHTML = text;
        return text; // Return the original text if no search term provided
      }
      // Escape special characters in the search term
      const escapedTerm = term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const regex = new RegExp(`(${escapedTerm})`, "gi");
      let highlightedText = document.createElement("span");
      highlightedText.textContent = text.replace(
        regex,
        `<span class="highlight">$1</span>`
      );

      // Return the HTML content
      return highlightedText.textContent;
    }

    const topicName = document.createElement("h2");
    topicName.classList.add("text-white", "text-xl", "font-bold");
    // console.log(topic.name);
    topicName.innerHTML =
      "topic name: " + highlightMatchedWords(topic.name, searchTerm);

    const topicDescription = document.createElement("p");
    topicDescription.classList.add("text-white", "text-xl", "font-bold");
    // console.log(topic.Description);
    topicDescription.innerHTML =
      "topic Description: " +
      highlightMatchedWords(topic.description, searchTerm);

    const sortProgramsButton = document.createElement("button");
    sortProgramsButton.textContent = "Sort Programs";
    sortProgramsButton.classList.add(
      "border-2",
      "p-1",
      "rounded-lg",
      "text-white"
    );

    sortProgramsButton.addEventListener("click", function () {
      if (ascending) {
        topic.programs.sort((a, b) => b.id - a.id);
      } else {
        topic.programs.sort((a, b) => a.id - b.id);
      }
      populateTopics(obj);
      ascending = !ascending;
    });

    const programsContainer = document.createElement("div");
    // console.log(programsContainer);
    topic.programs.forEach((program) => {
      const programContainer = document.createElement("div");
      programContainer.id = `${program.id}`;
      programContainer.classList.add("programCard");

      const programTitle = document.createElement("h2");
      // console.log(program.title);
      programTitle.innerHTML =
        "program title: " + highlightMatchedWords(program.title, searchTerm);

      const programDescription = document.createElement("p");
      programDescription.innerHTML =
        "program description: " +
        highlightMatchedWords(program.description, searchTerm);
      const programDescriptionShort = document.createElement("p");
      programDescriptionShort.innerHTML =
        "program description short: " +
        highlightMatchedWords(program.description_short, searchTerm);
      const programRoom = document.createElement("p");
      programRoom.textContent = "program room: " + program.room;

      const programTimeContainer = document.createElement("div");
      programTimeContainer.classList.add("flex", "gap-2");

      const programStartTime = document.createElement("div");
      programStartTime.textContent = "From: " + program.start_time;
      const programEndTime = document.createElement("div");
      programEndTime.textContent = "to " + program.end_time;

      programTimeContainer.appendChild(programStartTime);
      programTimeContainer.appendChild(programEndTime);

      programContainer.appendChild(programTitle);
      programContainer.appendChild(programDescription);
      programContainer.appendChild(programDescriptionShort);
      programContainer.appendChild(programRoom);
      programContainer.appendChild(programTimeContainer);

      // console.log(program.location);
      const locationContainer = document.createElement("div");
      locationContainer.id = `${program.location.id}`;

      const locationTitle = document.createElement("h3");
      locationTitle.textContent = "Location: " + program.location.title;
      const locationDescription = document.createElement("p");
      locationDescription.textContent =
        "Location Description: " + program.location.description;
      const locationAddress = document.createElement("p");
      locationAddress.textContent = "Address: " + program.location.address;
      const locationPostcode = document.createElement("p");
      locationPostcode.textContent = "Postcode: " + program.location.postcode;
      const locationWeb = document.createElement("a");
      locationWeb.href = `${program.location.website}`;
      locationWeb.textContent = "Web URL: " + program.location.website;

      const locationBooleans = document.createElement("div");
      locationBooleans.classList.add("flex", "gap-2");

      const locationActive = document.createElement("p");
      locationActive.classList.add("border-2", "p-1", "rounded-lg");
      locationActive.textContent =
        program.location.active == 1 ? "Active" : "Inactive";
      const locationAccessible = document.createElement("p");
      locationAccessible.classList.add("border-2", "p-1", "rounded-lg");
      locationAccessible.textContent =
        program.location.accessible == 1 ? "Accessible" : "Not accessible";
      const locationParking = document.createElement("p");
      locationParking.classList.add("border-2", "p-1", "rounded-lg");
      locationParking.textContent =
        program.location.parking == 1 ? "Has parking" : "No Parking";
      const locationBikeParking = document.createElement("p");
      locationBikeParking.classList.add("border-2", "p-1", "rounded-lg");
      locationBikeParking.textContent =
        program.location.bike_parking == 1
          ? "Has Bike Parking"
          : "No Bike Parking";

      locationBooleans.appendChild(locationActive);
      locationBooleans.appendChild(locationAccessible);
      locationBooleans.appendChild(locationParking);
      locationBooleans.appendChild(locationBikeParking);

      locationContainer.appendChild(locationTitle);
      locationContainer.appendChild(locationDescription);
      locationContainer.appendChild(locationAddress);
      locationContainer.appendChild(locationPostcode);
      locationContainer.appendChild(locationWeb);
      locationContainer.appendChild(locationBooleans);

      const programType = document.createElement("div");
      programType.textContent = "Program Type: " + program.programType.type;
      programType.classList.add(
        "text-[" + program.programType.type_colour + "]"
      );

      programContainer.appendChild(locationContainer);
      programContainer.appendChild(programType);

      programsContainer.appendChild(programContainer);
    });

    topicDetailsContainer.appendChild(topicContainerText);
    topicContainerText.appendChild(topicName);
    topicContainerText.appendChild(topicDescription);
    topicContainerText.appendChild(sortProgramsButton);
    // topicDetailsContainer.appendChild(topicCoverImage);

    topicsContainer.appendChild(topicDetailsContainer);
    topicsContainer.appendChild(programsContainer);

    header.appendChild(topicsContainer);
  });

  const topics = document.createElement("section");
  topics.textContent = `Topics: ${obj.topics.name}`;
}
populate();
})