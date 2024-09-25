# Video Call App

This monorepo contains a video call application built using WebRTC and Socket.IO for real-time video communication. The project is organized into two main directories:

-   `client`: Frontend built with React and Vite.
-   `server`: Backend built with Express and Socket.IO.

## Features

-   Real-time video calling using WebRTC.
-   Socket.IO for signaling and real-time communication between clients.
-   React for building the frontend user interface.
-   Vite as the frontend build tool.
-   Express.js as the backend framework for API and signaling server.
-   pnpm for managing the monorepo efficiently.

## Prerequisites

Ensure you have the following installed:

-   [Node.js](https://nodejs.org/en/) (v16+)
-   [pnpm](https://pnpm.io/) (v7+)

## Setup Instructions

1. **Clone the repository**:

    ```bash
    git clone https://github.com/abdulwaheed-apk/video-call-app.git
    cd video-call-app
    ```

2. **Install dependencies and Start the development servers** using pnpm:

    - For the **client**, navigate to the `client` directory and start the Vite development server:
        ```bash
        cd client
        pnpm install
        pnpm dev
        ```
    - The client will run on [http://localhost:5173/](http://localhost:5173/).

    - For the **server**, open a new terminal, navigate to the `server` directory, and start the Express server:
        ```bash
        cd server
        pnpm install
        pnpm start
        ```
    - The server will listen on port `8000` for Express and `8001` for Socket.IO.

## WebRTC Integration

The application uses **WebRTC** for peer-to-peer video calling and **Socket.IO** for signaling. The backend handles the signaling process required to establish WebRTC connections between clients.

### Client

-   The `client/` contains the React application that initializes the WebRTC connections using `navigator.mediaDevices.getUserMedia()` for media streams and establishes peer connections using WebRTC APIs.

### Server

-   The `server/` contains the Express.js application with Socket.IO to facilitate real-time communication between clients. It handles WebRTC signaling such as exchanging ICE candidates, offer, and answer messages.

## Contributing

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Make your changes.
4. Commit your changes (`git commit -m 'Add new feature'`).
5. Push to the branch (`git push origin feature-branch`).
6. Create a pull request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
