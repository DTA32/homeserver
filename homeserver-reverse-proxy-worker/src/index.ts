const error_html: string = `<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Server Down - DTA32</title>
        <style>
            h1,
            h2,
            p {
                margin: 0;
            }
        </style>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link
            href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:ital,wght@0,100..800;1,100..800&display=swap"
            rel="stylesheet"
        />
        <script lang="javascript">
        	setTimeout(() => {
				window.location.reload();
			}, 30000);
		</script>
    </head>
    <body
        style="
            background-color: #222932;
            font-family: 'JetBrains Mono', monospace;
            font-optical-sizing: auto;
            font-weight: 4000;
            font-style: normal;

        "
    >
        <main
            style="
                display: flex;
                flex-direction: column;
                justify-content: center;
                margin: 32px 0;
                gap: 48px;
                color: #f5f5f4;
                text-align: center;
            "
        >
            <h1 style="font-size: 96px">🙏</h1>
            <div style="display: flex; flex-direction: column; gap: 32px">
                <h2 style="font-size: 48px">Server Down</h2>
                <div style="display: flex; flex-direction: column; gap: 24px">
                    <p style="font-size: 24px">
                        My server currently down, I'm trying to wake it up now.
                    </p>
                    <p style="font-size: 24px">Will redirect you in a moment, please wait.</p>
                </div>
            </div>
            <h3 style="font-size: 24px">— DTA32</h3>
        </main>
    </body>
</html>
`

export default {
	async fetch(request, env, ctx): Promise<Response> {
		const wakeEndpoint = env.WAKE_ENDPOINT;

		try {
			const response = await fetch(request);

			if (response.status != 530) {
				return response;
			}
		} catch (error) {
			console.error("Error reaching main server:", error);
		}

		try {
			console.debug("Triggering Wake-on-LAN...");
			await fetch(wakeEndpoint, { method: "GET", headers: { "Content-Type": "application/json", "X-API-KEY": env.API_KEY } });
		} catch (error) {
			console.error("Error triggering WOL:", error);
		}

		return new Response(error_html, {
			headers: {
				"Content-Type": "text/html",
				"Cache-Control": "no-store",
			},
			status: 200,
		});
	},
} satisfies ExportedHandler<Env>;
