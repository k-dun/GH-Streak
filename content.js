function createContributionBar() {
  const contributionBar = document.createElement("div");
  contributionBar.id = "github-contribution-bar";
  document.body.insertBefore(contributionBar, document.body.firstChild);

  chrome.runtime.sendMessage({ action: "getContributionData" }, function (response) {
    if (response.error) {
      console.error("Error:", response.error);
      contributionBar.textContent = "Error fetching contribution data";
    } else {
      const parser = new DOMParser();
      const doc = parser.parseFromString(response.contributionData, "text/html");
      const contributionCalendar = doc.querySelector(".js-yearly-contributions");

      if (contributionCalendar) {
        const tooltips = contributionCalendar.querySelectorAll("tool-tip");
        const lastFourWeeksTooltips = Array.from(tooltips).slice(-28);

        const contributionSquaresContainer = document.createElement("div");
        contributionSquaresContainer.id = "contribution-squares-container";

        lastFourWeeksTooltips.forEach((tooltip) => {
          const contributionText = tooltip.textContent.match(/(\d+) contribution/);
          const contributionCount = contributionText ? parseInt(contributionText[1]) : 0;
          const date = tooltip.getAttribute("for").split("-").slice(-3).join("-");

          const contributionSquare = document.createElement("div");
          contributionSquare.classList.add("contribution-square");
          contributionSquare.style.backgroundColor = getColorByContributionCount(contributionCount);
          contributionSquare.title = `${contributionCount} contributions on ${date}`;
          contributionSquaresContainer.appendChild(contributionSquare);
        });

        contributionBar.appendChild(contributionSquaresContainer);
      } else {
        contributionBar.textContent = "Contribution calendar not found";
      }
    }
  });
}

function getColorByContributionCount(count) {
  if (count === 0) {
    return "#ebedf0";
  } else if (count >= 1 && count <= 8) {
    return "#9be9a8";
  } else if (count >= 9 && count <= 16) {
    return "#40c463";
  } else if (count >= 17 && count <= 24) {
    return "#30a14e";
  } else {
    return "#216e39";
  }
}

createContributionBar();