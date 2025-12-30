export default {
  async fetch() {
    return new Response('<h1>✅ Gemini App Live on Worker!</h1><p><a href="https://wispy-lake-289c.juliusgawo6.workers.dev">Open</a></p>', 
    { headers: {'Content-Type':'text/html'} });
  }
}
