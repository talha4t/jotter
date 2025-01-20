# Jotter

Jotter. It's a Storage Management Backend Application

## Notes

- This application will have three environments
    - local

## External Services

- MongoDB
- ABSTRACT API (To verify email)
- SMTP Server (For mail sending)

## Local Environment

### Prerequisites

- [Node JS](https://nodejs.org/en)
- [PNPM](https://pnpm.io)
- [Git](https://git-scm.com)
- [MongoDB](https://www.mongodb.com)

Verify the installation with:

```bash
node -v
pnpm -v
```

### Installation

1. **Clone the Repository**

    ```bash
    git clone https://github.com/talha4t/jotter.git
    cd jotter
    ```

2. **Install Dependencies**

    ```bash
    pnpm install
    ```

3. **Configure Environment**

    ```bash
    cp .env.example .env
    ```

    Edit `.env` to configure your database and other settings.

### Development

1. **Start Local Development Server**

    ```bash
    pnpm dev
    ```

    And visit [http://localhost:3000/](http://localhost:3000/) in your browser.
