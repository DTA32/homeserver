const waiting_room_html: string = `<!DOCTYPE html>
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
                        Oh no, looks like my server is down, gonna try to wake it up now.
                    </p>
                    <p style="font-size: 20px">It will be alive in a moment and i&apos;ll redirect you automatically, please wait.</p>
                </div>
            </div>
            <h3 style="font-size: 24px">— DTA32</h3>
        </main>
        <small style="position: absolute; bottom: 12px; right: 12px; color: #f5f5f4">yep, this server is on-demand</small>
    </body>
</html>
`

export default {
	async fetch(request, env, ctx): Promise<Response> {
		// validate request
		const requestUrl = new URL(request.url);
		if(!requestUrl.host.includes("dta32.my.id")){
			console.debug("Suspicious request to ", request.url);
			return new Response(
				"Where are you from? This worker is only accessible from dta32.my.id subdomain.",
				{ headers: { "Content-Type": "text/plain", "Cache-Control": "no-store" }, status: 403 }
			);
		}
		if(requestUrl.port != ""){
			console.debug("Suspicious request to: ", request.url);
			return new Response(
				"Nuh-uh, don't even try to access server ports.",
				{ headers: { "Content-Type": "text/plain", "Cache-Control": "no-store" }, status: 403 }
			);
		}
		if(requestUrl.pathname == "/.env" || requestUrl.pathname == "/.git"){
			console.debug("Suspicious request to ", request.url);
			return new Response(
				"Stop pen-testing my server, this is an on-demand server, pls be kind.",
				{ headers: { "Content-Type": "text/plain", "Cache-Control": "no-store" }, status: 403 }
			);
		}

		// ƒorward main server response, if server is reachable
		try {
			const response = await fetch(request);
			if (response.status != 530 && response.status != 502) {
				return response;
			}
		} catch (error) {
			console.debug("Error reaching main server:", error);
		}

		// trigger WOL and return waiting room if response is from argo tunnel indicating server down
		const wakeEndpoint = env.WAKE_ENDPOINT;
		try {
			console.debug("Triggering Wake-on-LAN...");
			await fetch(
				wakeEndpoint,
				{ method: "GET", headers: { "Content-Type": "application/json", "X-API-KEY": env.API_KEY } }
			);
		} catch (error) {
			console.debug("Error triggering WOL:", error);
		}
		return new Response(
			waiting_room_html,
			{ headers:
					{
					"Content-Type": "text/html",
					"Cache-Control": "no-store",
					"Retry-After": "30",
					},
				status: 503 }
		);
	},
} satisfies ExportedHandler<Env>;
