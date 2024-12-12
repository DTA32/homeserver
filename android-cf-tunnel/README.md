Termux gabisa pake ngrok/tailscale funnel karena dns resolver issue, jadi harus pake cloudflare tunnel.

Setup on termux:
1. `cloudflared tunnel login` lalu click link
2. `cloudflared tunnel create <new-tunnel-name>`
3. `cd ~/.cloudflared/`, edit and copy config.yml kesitu
4. `cloudflared tunnel route dns <created-tunnel-uuid> <desired-domain>`
5. `cloudflared tunnel run <created-tunnel-uuid>` and see if it's working
6. `nohup cloudflared tunnel --config /data/data/com.termux/files/home/.cloudflared/config.yml run <created-tunnel-uuid> &` to run in background
note: pake cara ini karena cloudflared termux gabisa di-connect ke dashboard pake `cloudflared service install`, memang jadi harus bikin tunnel baru tiap setup ulang