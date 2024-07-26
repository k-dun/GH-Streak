function createContributionBar() {
  const contributionBar = document.createElement("div");
  contributionBar.id = "github-contribution-bar";
  document.body.insertBefore(contributionBar, document.body.firstChild);

  chrome.runtime.sendMessage({ action: "getContributionData" }, function (response) {
    if (response.error) {
      console.error("Error:", response.error);
      contributionBar.textContent = "Error fetching contribution data";
    } else {
      const contributionData = parseContributionData(response.contributionData);
      displayContributionSquares(contributionBar, contributionData);
    }
  });
}

function parseContributionData(html) {
  const regex = /<tool-tip[^>]*>(\d+) contributions? on ([^<]+)\.<\/tool-tip>|<tool-tip[^>]*>No contributions on ([^<]+)\.<\/tool-tip>/g;
  const contributions = {};
  let match;

  const currentYear = new Date().getFullYear();

  while ((match = regex.exec(html)) !== null) {
    let date, count;
    if (match[1] && match[2]) {
      count = parseInt(match[1]);
      date = parseDate(match[2], currentYear);
    } else if (match[3]) {
      count = 0;
      date = parseDate(match[3], currentYear);
    }

    if (date) {
      contributions[date] = count;
    }
  }

  return contributions;
}

function parseDate(dateString, year) {
  const months = {
    'January': 0, 'February': 1, 'March': 2, 'April': 3, 'May': 4, 'June': 5, 'July': 6, 'August': 7, 'September': 8, 'October': 9, 'November': 10, 'December': 11
  };

  const [month, dayStr] = dateString.split(' ');
  const day = parseInt(dayStr);
  const monthIndex = months[month];

  if (monthIndex !== undefined && !isNaN(day)) {
    const date = new Date(year, monthIndex, day);
    if (!isNaN(date.getTime())) {
      return date.toISOString().split('T')[0];
    }
  }

  console.error(`Invalid date string: ${dateString}`);
  return null;
}

function displayContributionSquares(container, contributionData) {
  const contributionSquaresContainer = document.createElement("div");
  contributionSquaresContainer.id = "contribution-squares-container";

  const today = new Date();
  const fourWeeksAgo = new Date(today);
  fourWeeksAgo.setDate(today.getDate() - 27);

  for (let date = fourWeeksAgo; date <= today; date.setDate(date.getDate() + 1)) {
    const formattedDate = date.toISOString().split('T')[0];
    
    const lookupDate = new Date(date);
    lookupDate.setDate(lookupDate.getDate() - 1);
    const lookupFormattedDate = lookupDate.toISOString().split('T')[0];
    
    const contributionCount = contributionData[lookupFormattedDate] || 0;

    const contributionSquare = document.createElement("div");
    contributionSquare.classList.add("contribution-square");
    contributionSquare.style.backgroundColor = contributionCount > 0 ? "#40c463" : "#ebedf0";
    contributionSquare.title = `${contributionCount} contribution${contributionCount !== 1 ? 's' : ''} on ${formattedDate}`;
    contributionSquaresContainer.appendChild(contributionSquare);
  }

  container.appendChild(contributionSquaresContainer);
}

createContributionBar();