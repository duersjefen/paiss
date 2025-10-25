/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "paiss-website",
      removal: input?.stage === "production" ? "retain" : "remove",
      home: "aws",
      providers: {
        aws: {
          region: "eu-north-1",
        },
      },
    };
  },
  async run() {
    // API Gateway for contact form
    const api = new sst.aws.ApiGatewayV2("ContactApi", {
      cors: {
        allowOrigins: [
          $app.stage === "production"
            ? "https://paiss.me"
            : $app.stage === "staging"
            ? "https://staging.paiss.me"
            : "http://localhost:*", // Dev stage - allow any localhost port
          "http://localhost:8002", // Default Vite port
          "http://localhost:5173", // Alternative Vite port
        ],
        allowMethods: ["POST", "OPTIONS"],
        allowHeaders: ["Content-Type"],
      },
    });

    // Contact form route with Lambda handler
    api.route("POST /contact", {
      handler: "src/lambda/contact.handler",
      nodejs: {
        esbuild: {
          external: ["@aws-sdk"],
        },
      },
      permissions: [
        {
          actions: ["ses:SendEmail", "ses:SendRawEmail"],
          resources: ["*"],
        },
      ],
      environment: {
        STAGE: $app.stage,
        TURNSTILE_SECRET_KEY: process.env.TURNSTILE_SECRET_KEY || "",
      },
    });

    // Static site configuration (Vite build)
    const site = new sst.aws.StaticSite("PaissWebsiteSite", {
      path: ".",
      build: {
        command: "npm run build",
        output: "dist",
      },
      environment: {
        VITE_API_URL: api.url,
        VITE_TURNSTILE_SITE_KEY: process.env.TURNSTILE_SITE_KEY || "",
      },
      // Custom domain with Route53 DNS management (not for dev stage)
      domain:
        $app.stage === "production"
          ? "paiss.me"
          : $app.stage === "staging"
          ? "staging.paiss.me"
          : undefined, // Dev stage uses CloudFront URL
    });

    return {
      url: site.url,
      domain: site.domain,
      apiUrl: api.url,
    };
  },
});
