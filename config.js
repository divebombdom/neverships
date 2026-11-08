/*
  NeverShips — site configuration
  ---------------------------------
  1. Apply for Google AdSense at https://adsense.google.com with your own domain.
  2. Once approved, paste your publisher ID below (looks like "ca-pub-1234567890123456").
  3. Create "Display" ad units in AdSense and paste each unit's data-ad-slot number below.
  4. Edit ads.txt in the site root so it contains your publisher ID.

  While adsenseClient is empty, ad slots are hidden. Add ?showads=1 to the URL (or run on localhost) to see placeholder boxes
  where the ads will appear.
*/
window.NEVERSHIPS_CONFIG = {
  siteName: "NeverShips",
  adsenseClient: "ca-pub-7804394701272579",        // e.g. "ca-pub-1234567890123456"
  slots: {
    top: "",                  // leaderboard under the header
    deals: "",                // in-feed, after lightning deals
    catalog: "",              // in-feed, inside the product grid
    tracker: "",              // shown while a package is "in transit"
    footer: ""                // above the footer
  }
};
