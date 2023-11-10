# Project Startup

Two terminals needed to startup locally

1.        cd server
          npm run i
          npm run build
          npm run dev

Keep server running while starting client

2.        cd client
          npm run i
          npm run build
          npm run dev

### Tech Stacks

_Front End:_

- React.js
- Next.js
- TypeScript
- Bootstrap
- Bootstrap Icons
- Recharts

_Back End:_

- Node.js
- nodemon
- Express.js
- Cors
- REST API

### User Interactions

- User selects the Time-Frame
- User selects the Country
- User sees the average Co2 based on selections

- User can Add Purchases by clicking on the button OR by pressing enter in the numbers-input field
- User selects the Date (past constraint has been added)
- User inserts the Number of Trees purchased by typing or mouse-scrolling
- User can delete a field by clicking on the Trash Icon
- User sees

  - Total USD field which calculates how much the Trees cost
  - The amount of entries they have
  - The total amount of trees purchased
  - The total amount of costs in USD based on the Total of the Trees AND the yearly cost of $12

- User presses the Calculate Offset button which displays a graph of the average Co2 consumption by Date:

  - The user's Offset
  - The country's avg per person

- User sees a summary of carbon neutrality details
