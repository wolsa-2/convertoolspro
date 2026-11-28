export const TOOLS_SEO_CONTENT: Record<string, string> = {
  "character-counter": `
    <h2>About Character Counter</h2>
    <p>Our Character Counter is a powerful, real-time text analysis tool designed for writers, students, and digital marketers. It provides instant feedback on your text's length, helping you stay within specific limits for social media, SEO meta tags, or academic assignments.</p>
    
    <h2>How to Use the Character Counter</h2>
    <ol>
      <li>Paste your text into the large input area or start typing directly.</li>
      <li>Watch the statistics update instantly as you type.</li>
      <li>Check the total character count (including spaces).</li>
      <li>Review the word count for a quick overview of your content's length.</li>
      <li>See the line count to understand the structure of your text.</li>
      <li>Copy the analyzed text or clear the field to start a new project.</li>
    </ol>

    <h2>Example Use Cases</h2>
    <ul>
      <li><strong>SEO Optimization:</strong> Ensure your meta titles (under 60 chars) and descriptions (under 160 chars) are perfect for Google.</li>
      <li><strong>Social Media:</strong> Draft tweets within the 280-character limit or Instagram captions that don't get truncated.</li>
      <li><strong>Academic Writing:</strong> Stay within strict word counts for essays and research papers.</li>
      <li><strong>Programming:</strong> Check the length of strings for database constraints or API requirements.</li>
    </ul>

    <h2>Frequently Asked Questions</h2>
    <div class="faq-item">
      <h3>Does this tool count spaces?</h3>
      <p>Yes, our tool provides a total character count that includes spaces, as this is the standard requirement for most platforms.</p>
    </div>
    <div class="faq-item">
      <h3>Is my text saved on your servers?</h3>
      <p>No. Like all our tools, the Character Counter processes everything locally in your browser. Your text never leaves your device.</p>
    </div>
  `,
  "password-generator": `
    <h2>About Password Generator</h2>
    <p>In an era of increasing cyber threats, a strong password is your first line of defense. Our Password Generator creates cryptographically secure, random strings that are virtually impossible to guess or brute-force.</p>
    
    <h2>How to Use the Password Generator</h2>
    <ol>
      <li>Choose your desired password length (we recommend at least 16 characters).</li>
      <li>Toggle the inclusion of uppercase letters, lowercase letters, numbers, and symbols.</li>
      <li>Click the "Generate Password" button to create a new random string.</li>
      <li>Use the "Copy" button to save the password to your clipboard.</li>
      <li>Generate multiple passwords until you find one that suits your needs.</li>
      <li>Immediately save the password in your preferred password manager.</li>
    </ol>

    <h2>Example Use Cases</h2>
    <ul>
      <li><strong>Account Security:</strong> Create unique, strong passwords for every online service you use.</li>
      <li><strong>Wi-Fi Security:</strong> Generate a complex WPA2/WPA3 key for your home or office network.</li>
      <li><strong>Database Credentials:</strong> Secure your backend systems with random, high-entropy strings.</li>
      <li><strong>API Keys:</strong> Generate secure tokens for your own applications and services.</li>
    </ul>

    <h2>Frequently Asked Questions</h2>
    <div class="faq-item">
      <h3>Are the generated passwords truly random?</h3>
      <p>Yes, we use the browser's built-in <code>crypto.getRandomValues()</code> API, which provides high-quality, cryptographically secure randomness.</p>
    </div>
    <div class="faq-item">
      <h3>Can you see the passwords I generate?</h3>
      <p>Absolutely not. The generation happens entirely on your local machine. We have no way of seeing or storing your passwords.</p>
    </div>
  `,
  "base64-codec": `
    <h2>About Base64 Encode/Decode</h2>
    <p>Base64 is a group of binary-to-text encoding schemes that represent binary data in an ASCII string format. Our tool provides a simple, fast way to encode or decode text, making it easier to transmit data over media that are designed to deal with textual data.</p>
    
    <h2>How to Use the Base64 Tool</h2>
    <ol>
      <li>Select whether you want to "Encode" or "Decode" from the toggle.</li>
      <li>Enter your raw text or Base64 string into the input field.</li>
      <li>The tool will automatically process your input in real-time.</li>
      <li>Review the output in the result area below.</li>
      <li>Use the "Copy" button to quickly grab the result.</li>
      <li>Clear the input to perform another conversion.</li>
    </ol>

    <h2>Example Use Cases</h2>
    <ul>
      <li><strong>Data Transmission:</strong> Encode complex data strings for inclusion in URLs or hidden form fields.</li>
      <li><strong>Email Attachments:</strong> Understand how binary files are represented in email protocols.</li>
      <li><strong>Web Development:</strong> Decode Base64 strings found in CSS or HTML source code.</li>
      <li><strong>API Integration:</strong> Encode credentials for Basic Authentication headers.</li>
    </ul>

    <h2>Frequently Asked Questions</h2>
    <div class="faq-item">
      <h3>Is Base64 a form of encryption?</h3>
      <p>No. Base64 is an encoding scheme, not encryption. It is easily reversible and provides no security or secrecy.</p>
    </div>
    <div class="faq-item">
      <h3>Can I encode images here?</h3>
      <p>This specific tool is for text. For images, please use our dedicated "Image to Base64" tool found in the Image category.</p>
    </div>
  `,
  "json-formatter": `
    <h2>About JSON Formatter</h2>
    <p>JSON (JavaScript Object Notation) is the standard for data exchange on the web. However, raw JSON is often minified and unreadable. Our JSON Formatter helps you beautify, minify, and validate your JSON data instantly.</p>
    
    <h2>How to Use the JSON Formatter</h2>
    <ol>
      <li>Paste your raw or messy JSON code into the input editor.</li>
      <li>Click "Beautify" to add indentation and make the code human-readable.</li>
      <li>Click "Minify" to remove all whitespace for production use.</li>
      <li>Check for syntax errors—the tool will highlight any issues in your JSON.</li>
      <li>Use the "Copy" button to save the formatted result.</li>
      <li>Use the "Clear" button to start fresh with a new payload.</li>
    </ol>

    <h2>Example Use Cases</h2>
    <ul>
      <li><strong>API Debugging:</strong> Paste messy responses from your API to understand the data structure.</li>
      <li><strong>Config Management:</strong> Format <code>package.json</code> or <code>config.json</code> files for better readability.</li>
      <li><strong>Data Preparation:</strong> Minify JSON files before deploying them to a production server to save bandwidth.</li>
      <li><strong>Learning:</strong> Study the structure of complex JSON objects by visualizing them clearly.</li>
    </ul>

    <h2>Frequently Asked Questions</h2>
    <div class="faq-item">
      <h3>Does this tool validate my JSON?</h3>
      <p>Yes, if your JSON is malformed, the tool will display an error message helping you identify the syntax issue.</p>
    </div>
    <div class="faq-item">
      <h3>Is there a limit to the JSON size?</h3>
      <p>While we can handle very large payloads, extremely massive files (hundreds of MBs) might slow down your browser. For most daily tasks, it is lightning fast.</p>
    </div>
  `,
  "qr-generator": `
    <h2>About QR Code Generator</h2>
    <p>QR codes are a convenient way to bridge the gap between the physical and digital worlds. Our generator allows you to create high-quality, custom QR codes for URLs, text, or contact information in seconds.</p>
    
    <h2>How to Use the QR Generator</h2>
    <ol>
      <li>Enter the URL or text you want to encode into the input field.</li>
      <li>Adjust the size of the QR code if needed.</li>
      <li>The QR code will update instantly as you change the input.</li>
      <li>Test the code with your smartphone camera to ensure it works correctly.</li>
      <li>Right-click the generated image to save it to your computer.</li>
      <li>Clear the input to generate a different code.</li>
    </ol>

    <h2>Example Use Cases</h2>
    <ul>
      <li><strong>Marketing:</strong> Add QR codes to business cards, flyers, or posters to link to your website.</li>
      <li><strong>Contact Sharing:</strong> Create a QR code that links to your digital portfolio or LinkedIn profile.</li>
      <li><strong>Event Management:</strong> Use QR codes on tickets or signage for quick check-ins.</li>
      <li><strong>Personal Use:</strong> Share your Wi-Fi password or a specific location with friends easily.</li>
    </ul>

    <h2>Frequently Asked Questions</h2>
    <div class="faq-item">
      <h3>Do these QR codes expire?</h3>
      <p>No. These are static QR codes, meaning the data is encoded directly into the pattern. They will work forever as long as the link remains active.</p>
    </div>
    <div class="faq-item">
      <h3>Can I customize the colors?</h3>
      <p>Currently, we provide standard high-contrast black and white codes for maximum compatibility with all scanners.</p>
    </div>
  `,
  "case-converter": `
    <h2>About Case Converter</h2>
    <p>Consistency in text casing is crucial for professional writing and clean code. Our Case Converter allows you to transform your text into various formats like UPPERCASE, lowercase, camelCase, snake_case, and more with a single click.</p>
    
    <h2>How to Use the Case Converter</h2>
    <ol>
      <li>Paste your text into the input area.</li>
      <li>Choose your desired format (e.g., "UPPERCASE", "lowercase", "Title Case").</li>
      <li>For developers, select "camelCase", "snake_case", or "PascalCase".</li>
      <li>The text will be converted instantly in the output field.</li>
      <li>Click the "Copy" button to save the result.</li>
      <li>Use the "Clear" button to start over with new text.</li>
    </ol>

    <h2>Example Use Cases</h2>
    <ul>
      <li><strong>Content Creation:</strong> Quickly fix accidental CAPS LOCK text or format blog titles into Title Case.</li>
      <li><strong>Programming:</strong> Convert variable names between different naming conventions (e.g., snake_case to camelCase).</li>
      <li><strong>Data Entry:</strong> Standardize a list of names or addresses into a consistent format.</li>
      <li><strong>Social Media:</strong> Create stylized text for bios or posts.</li>
    </ul>

    <h2>Frequently Asked Questions</h2>
    <div class="faq-item">
      <h3>Does it support multi-line text?</h3>
      <p>Yes, the converter works perfectly with multi-line paragraphs and lists.</p>
    </div>
    <div class="faq-item">
      <h3>What is Title Case?</h3>
      <p>Title Case capitalizes the first letter of every word, which is the standard format for book and article titles.</p>
    </div>
  `,
  "hash-generator": `
    <h2>About Hash Generator</h2>
    <p>Cryptographic hashing is a fundamental part of data integrity and security. Our Hash Generator allows you to create MD5, SHA-1, SHA-256, and SHA-512 hashes from any text input locally in your browser.</p>
    
    <h2>How to Use the Hash Generator</h2>
    <ol>
      <li>Type or paste your text into the input field.</li>
      <li>Select your preferred hashing algorithm (we recommend SHA-256 for security).</li>
      <li>The hash will be generated instantly as you type.</li>
      <li>Review the hexadecimal output in the result box.</li>
      <li>Use the "Copy" button to grab the hash.</li>
      <li>Clear the input to generate a hash for a different string.</li>
    </ol>

    <h2>Example Use Cases</h2>
    <ul>
      <li><strong>Data Integrity:</strong> Generate a hash for a file or string to verify it hasn't been tampered with.</li>
      <li><strong>Password Security:</strong> Understand how passwords are stored securely in databases.</li>
      <li><strong>Digital Signatures:</strong> Create unique identifiers for digital assets.</li>
      <li><strong>Development:</strong> Generate unique keys for caching or indexing data.</li>
    </ul>

    <h2>Frequently Asked Questions</h2>
    <div class="faq-item">
      <h3>Can I reverse a hash?</h3>
      <p>No. Hashing is a one-way process. You cannot "decrypt" a hash to get the original text back.</p>
    </div>
    <div class="faq-item">
      <h3>Which algorithm should I use?</h3>
      <p>For security-sensitive tasks, always use SHA-256 or higher. MD5 and SHA-1 are considered weak and should only be used for non-security tasks like checksums.</p>
    </div>
  `,
  "bionic-reading": `
    <h2>About Bionic Reading</h2>
    <p>Bionic Reading is a new method that facilitates the reading process by guiding the eyes through text with artificial fixation points. By bolding the first few letters of each word, it helps your brain recognize words faster, improving both speed and focus.</p>
    
    <h2>How to Use Bionic Reading</h2>
    <ol>
      <li>Paste the text you want to read into the input area.</li>
      <li>The tool will instantly convert it into the Bionic Reading format.</li>
      <li>Read the text in the output area to experience the increased focus.</li>
      <li>Adjust the input text as needed to see the effect on different content.</li>
      <li>Copy the formatted text if you want to use it in another application.</li>
      <li>Clear the input to start a new reading session.</li>
    </ol>

    <h2>Example Use Cases</h2>
    <ul>
      <li><strong>Studying:</strong> Process dense academic papers or technical documentation more efficiently.</li>
      <li><strong>Accessibility:</strong> Many users with ADHD or dyslexia find Bionic Reading helps them stay focused on the text.</li>
      <li><strong>Speed Reading:</strong> Train your brain to recognize words faster and reduce subvocalization.</li>
      <li><strong>Content Review:</strong> Quickly skim through long drafts or reports without losing the main points.</li>
    </ul>

    <h2>Frequently Asked Questions</h2>
    <div class="faq-item">
      <h3>Does it work for all languages?</h3>
      <p>It works best for Latin-based languages (English, Spanish, French, etc.) where word structure follows standard patterns.</p>
    </div>
    <div class="faq-item">
      <h3>Can I export the formatted text?</h3>
      <p>Yes, you can copy the output, though the bolding effect depends on the destination application's support for rich text or HTML.</p>
    </div>
  `,
  "webcam-test": `
    <h2>About Webcam Test</h2>
    <p>Before an important meeting or stream, it's vital to ensure your hardware is working correctly. Our Webcam Test tool provides a private, secure way to check your camera and microphone functionality directly in your browser.</p>
    
    <h2>How to Use the Webcam Test</h2>
    <ol>
      <li>Click the "Start Test" or "Allow Camera" button when prompted.</li>
      <li>Grant the browser permission to access your camera and microphone.</li>
      <li>Check the live video feed to ensure your camera is clear and correctly positioned.</li>
      <li>Speak into your microphone and watch the volume meter to verify audio input.</li>
      <li>Review the detected device information (name, resolution).</li>
      <li>Click "Stop Test" to disconnect the camera and microphone when finished.</li>
    </ol>

    <h2>Example Use Cases</h2>
    <ul>
      <li><strong>Meeting Prep:</strong> Verify your setup before joining a Zoom, Teams, or Google Meet call.</li>
      <li><strong>Hardware Troubleshooting:</strong> Determine if a camera issue is hardware-related or software-specific.</li>
      <li><strong>Stream Setup:</strong> Check your lighting and framing before going live on Twitch or YouTube.</li>
      <li><strong>Privacy Check:</strong> Ensure your camera isn't being used by other background processes.</li>
    </ul>

    <h2>Frequently Asked Questions</h2>
    <div class="faq-item">
      <h3>Do you record my video or audio?</h3>
      <p>Never. The stream is processed entirely within your browser and is never sent to any server. Your privacy is 100% protected.</p>
    </div>
    <div class="faq-item">
      <h3>Why isn't my camera showing up?</h3>
      <p>Ensure you've granted the necessary permissions in your browser settings and that no other application is currently using the camera.</p>
    </div>
  `,
  "image-placeholder": `
    <h2>About Image Placeholder</h2>
    <p>In the fast-paced world of web development, speed and efficiency are paramount. Our Image Placeholder generator allows you to create custom images for your wireframes and prototypes instantly.</p>
    
    <h2>How to Use the Image Placeholder Tool</h2>
    <ol>
      <li>Enter your desired width and height in pixels.</li>
      <li>Customize the background color to match your design.</li>
      <li>Choose a contrasting text color for the label.</li>
      <li>Add custom text to identify the section (e.g., "Hero Banner").</li>
      <li>The placeholder updates in real-time as you change the settings.</li>
      <li>Download the image or copy the dynamic URL for use in your code.</li>
    </ol>

    <h2>Example Use Cases</h2>
    <ul>
      <li><strong>Wireframing:</strong> Reserve space for images in your initial layouts before final assets are ready.</li>
      <li><strong>UI Prototyping:</strong> Test how different image sizes affect your responsive design.</li>
      <li><strong>Email Templates:</strong> Use placeholders to test the layout of HTML emails.</li>
      <li><strong>Documentation:</strong> Create clear diagrams or examples for technical guides.</li>
    </ul>

    <h2>Frequently Asked Questions</h2>
    <div class="faq-item">
      <h3>Can I use the URL directly in my HTML?</h3>
      <p>Yes! Our tool provides a dynamic URL that you can paste into your <code>&lt;img src="..."&gt;</code> tags for instant results.</p>
    </div>
    <div class="faq-item">
      <h3>Is this tool free for commercial use?</h3>
      <p>Yes, all images generated are free to use in both personal and commercial projects.</p>
    </div>
  `,
  "image-to-base64": `
    <h2>About Image to Base64</h2>
    <p>Converting images to Base64 strings allows you to embed visual assets directly into your HTML or CSS files. This can reduce the number of HTTP requests and improve the loading performance of small icons or critical UI elements.</p>
    
    <h2>How to Use the Image to Base64 Tool</h2>
    <ol>
      <li>Drag and drop your image file or click to select one from your computer.</li>
      <li>The tool will instantly process the image locally in your browser.</li>
      <li>Review the generated Base64 string in the output area.</li>
      <li>Choose between the raw string or a ready-to-use Data URL.</li>
      <li>Click the "Copy" button to save the result to your clipboard.</li>
      <li>Clear the tool to process a different image.</li>
    </ol>

    <h2>Example Use Cases</h2>
    <ul>
      <li><strong>Web Performance:</strong> Embed small icons or logos directly in CSS to eliminate extra network requests.</li>
      <li><strong>Email Design:</strong> Include images in HTML emails without relying on external hosting.</li>
      <li><strong>Single-File Apps:</strong> Create portable HTML files that include all necessary visual assets.</li>
      <li><strong>Data Storage:</strong> Store small images directly in database text fields.</li>
    </ul>

    <h2>Frequently Asked Questions</h2>
    <div class="faq-item">
      <h3>Does Base64 increase the file size?</h3>
      <p>Yes, Base64 encoding typically increases the data size by about 33%. It is best used for small assets where the benefit of fewer HTTP requests outweighs the size increase.</p>
    </div>
    <div class="faq-item">
      <h3>Are my images uploaded to your server?</h3>
      <p>No. The conversion happens entirely within your browser. Your images never leave your device.</p>
    </div>
  `,
  "pdf-metadata": `
    <h2>About PDF Metadata</h2>
    <p>PDF files often contain "hidden" information like the author's name, creation date, and the software used. This read-only tool lets you inspect document details before sharing or archiving a PDF.</p>
    
    <h2>How to Use the PDF Metadata Tool</h2>
    <ol>
      <li>Upload your PDF file by dragging it into the drop zone.</li>
      <li>Review the displayed metadata, including title, author, subject, creator, producer, dates, and page count.</li>
      <li>Remove the current file and select another PDF when finished.</li>
    </ol>

    <h2>Example Use Cases</h2>
    <ul>
      <li><strong>Privacy Review:</strong> Check whether author names or software details are present before sharing a document.</li>
      <li><strong>Document Review:</strong> Inspect title, author, subject, creator, and producer fields.</li>
      <li><strong>Archiving:</strong> Check creation and modification dates before organizing documents.</li>
      <li><strong>Organization:</strong> Sort and compare documents using their available metadata details.</li>
    </ul>

    <h2>Frequently Asked Questions</h2>
    <div class="faq-item">
      <h3>Is my PDF data safe?</h3>
      <p>Yes. All processing happens locally in your browser. Your PDF files are never uploaded to our servers.</p>
    </div>
    <div class="faq-item">
      <h3>Can I remove all metadata?</h3>
      <p>No. This tool currently displays metadata only; it does not edit or remove metadata. Use a dedicated PDF editor for those changes.</p>
    </div>
  `,
  "jpg-to-pdf": `
    <h2>About JPG to PDF</h2>
    <p>Consolidating multiple images into a single PDF document is a common task for professional and personal organization. Our tool allows you to merge multiple JPG or PNG files into a clean, high-quality PDF in seconds.</p>
    
    <h2>How to Use the JPG to PDF Tool</h2>
    <ol>
      <li>Select or drag and drop multiple image files into the tool.</li>
      <li>Use the "Move Up" or "Move Down" buttons to arrange the images in your desired order.</li>
      <li>Remove any unwanted images from the list.</li>
      <li>Click the "Convert to PDF" button to generate the document.</li>
      <li>The PDF will be generated locally and downloaded automatically.</li>
      <li>Clear the tool to start a new conversion project.</li>
    </ol>

    <h2>Example Use Cases</h2>
    <ul>
      <li><strong>Expense Reports:</strong> Merge multiple receipt photos into a single document for easy submission.</li>
      <li><strong>Digital Portfolios:</strong> Combine your best design work into a portable PDF presentation.</li>
      <li><strong>Document Scanning:</strong> Turn photos of physical documents into a multi-page PDF.</li>
      <li><strong>Sharing Memories:</strong> Create a simple PDF photo album to share with friends and family.</li>
    </ul>

    <h2>Frequently Asked Questions</h2>
    <div class="faq-item">
      <h3>Is there a limit to the number of images?</h3>
      <p>There is no hard limit, but processing hundreds of high-resolution images at once may require more system memory. For most tasks, it is extremely fast.</p>
    </div>
    <div class="faq-item">
      <h3>Are my photos private?</h3>
      <p>Yes. The conversion happens entirely in your browser. Your images are never uploaded to any server.</p>
    </div>
  `,
  "tweet-generator": `
    <h2>About Tweet Generator</h2>
    <p>Our Tweet Generator is a fun and creative tool for making realistic social media mockups. It's perfect for designers, marketers, and meme creators who want to visualize social media interactions without needing a live account.</p>
    
    <h2>How to Use the Tweet Generator</h2>
    <ol>
      <li>Enter the display name and handle for the profile.</li>
      <li>Upload a profile picture or use a placeholder.</li>
      <li>Type the content of the tweet in the main text area.</li>
      <li>Customize the engagement metrics (Retweets, Quotes, Likes).</li>
      <li>Choose the date and time for the tweet.</li>
      <li>Download the final image as a PNG to share or use in your designs.</li>
    </ol>

    <h2>Example Use Cases</h2>
    <ul>
      <li><strong>UI/UX Design:</strong> Create realistic social media feeds for app prototypes.</li>
      <li><strong>Marketing:</strong> Brainstorm and visualize viral content ideas for your brand.</li>
      <li><strong>Education:</strong> Use mock tweets to teach digital literacy or social media history.</li>
      <li><strong>Entertainment:</strong> Create harmless memes and jokes to share with friends.</li>
    </ul>

    <h2>Frequently Asked Questions</h2>
    <div class="faq-item">
      <h3>Is this for real tweeting?</h3>
      <p>No. This tool generates an image that looks like a tweet. It does not post anything to the actual X (Twitter) platform.</p>
    </div>
    <div class="faq-item">
      <h3>Can I use this for misinformation?</h3>
      <p>No. We strictly prohibit the use of this tool for deception, impersonation, or spreading false information. Please use it responsibly.</p>
    </div>
  `,
  "html-entities": `
    <h2>About HTML Entities</h2>
    <p>HTML entities are used to display reserved characters (like &lt;, &gt;, and &amp;) or special symbols in web browsers. Our tool allows you to easily encode or decode these entities to ensure your web content renders correctly.</p>
    
    <h2>How to Use the HTML Entities Tool</h2>
    <ol>
      <li>Select whether you want to "Encode" or "Decode" from the toggle.</li>
      <li>Paste your text or HTML code into the input field.</li>
      <li>The tool will automatically process the text in real-time.</li>
      <li>Review the result in the output area.</li>
      <li>Use the "Copy" button to save the result.</li>
      <li>Clear the input to perform another conversion.</li>
    </ol>

    <h2>Example Use Cases</h2>
    <ul>
      <li><strong>Web Development:</strong> Safely display code snippets on your blog or website.</li>
      <li><strong>Data Sanitization:</strong> Encode user input to prevent XSS (Cross-Site Scripting) attacks.</li>
      <li><strong>Content Management:</strong> Fix broken symbols or characters in your CMS.</li>
      <li><strong>Email Templates:</strong> Ensure special characters are correctly represented in HTML emails.</li>
    </ul>

    <h2>Frequently Asked Questions</h2>
    <div class="faq-item">
      <h3>What is the difference between encoding and decoding?</h3>
      <p>Encoding turns characters like "&lt;" into "&amp;lt;", while decoding turns "&amp;lt;" back into "&lt;".</p>
    </div>
    <div class="faq-item">
      <h3>Does it support all HTML5 entities?</h3>
      <p>Yes, we support a wide range of standard HTML5 entities, including common symbols and accented characters.</p>
    </div>
  `,

  "merge-pdf": `
    <h2>About Merge PDF</h2>
    <p>Merge PDF combines two or more PDF documents into one file. Select the source PDFs, process them together, and download the combined document.</p>
    <h2>How to Merge PDF Files</h2>
    <ol>
      <li>Select at least two PDF files from your device.</li>
      <li>Add any additional PDF files you want to include.</li>
      <li>Start processing to combine the documents in the selected order.</li>
      <li>Download the merged PDF and check the resulting page sequence.</li>
    </ol>
    <h2>Privacy and processing</h2>
    <p>The current PDF operation uses browser-side PDF processing. Keep the original files until you have checked the merged document.</p>
  `,
  "split-pdf": `
    <h2>About Split PDF</h2>
    <p>Split PDF separates a multi-page PDF into individual one-page PDF files. Upload one PDF, process it, and download the page files you need.</p>
    <h2>How to Split a PDF</h2>
    <ol>
      <li>Select one PDF file from your device.</li>
      <li>Review the selected file and start processing.</li>
      <li>PhotoSize creates a separate PDF for each page.</li>
      <li>Download the individual page files from the results.</li>
    </ol>
    <h2>Important limits</h2>
    <p>The current browser-based splitter supports PDFs with up to 100 pages to help maintain mobile browser stability. A one-page PDF cannot be split into separate pages.</p>
    <h2>Privacy and processing</h2>
    <p>The current PDF operation uses browser-side PDF processing. Keep the original file until you have checked the downloaded pages.</p>
  `,
  "rotate-pdf": `
    <h2>About Rotate PDF</h2>
    <p>Rotate PDF changes the page orientation of a PDF by rotating every page 90 degrees at a time. It is useful when scanned or saved pages appear sideways.</p>
    <h2>How to Rotate a PDF</h2>
    <ol>
      <li>Select one PDF file from your device.</li>
      <li>Check that the correct document is selected.</li>
      <li>Start processing to rotate each page by 90 degrees.</li>
      <li>Download the rotated PDF and review its pages.</li>
    </ol>
    <h2>Supported workflow</h2>
    <p>The current tool processes one PDF at a time and applies the rotation to every page in that document.</p>
    <h2>Privacy and processing</h2>
    <p>The current PDF operation uses browser-side PDF processing. Keep your original file until you have verified the rotated copy.</p>
  `,
  "watermark-pdf": `
    <h2>About Watermark PDF</h2>
    <p>Watermark PDF adds a text watermark to the pages of a PDF. You can edit the watermark text before processing; the default text is PhotoSize.</p>
    <h2>How to Add a PDF Watermark</h2>
    <ol>
      <li>Select one PDF file from your device.</li>
      <li>Enter the watermark text. The current input accepts up to 80 characters.</li>
      <li>Start processing to apply the text to each page.</li>
      <li>Download the watermarked PDF and check the result.</li>
    </ol>
    <h2>Watermark details</h2>
    <p>The current tool applies semi-transparent text to each page and processes one PDF at a time.</p>
    <h2>Privacy and processing</h2>
    <p>The current PDF operation uses browser-side PDF processing. Keep your original document until you have reviewed the watermarked copy.</p>
  `

};

export interface FAQItem {
  question: string;
  answer: string;
}

export const TOOLS_FAQ: Record<string, FAQItem[]> = {
  "character-counter": [
    {
      question: "Does this tool count spaces?",
      answer: "Yes, our tool provides a total character count that includes spaces, as this is the standard requirement for most social media and SEO platforms."
    },
    {
      question: "Is my text saved on your servers?",
      answer: "No. All processing happens locally in your browser. Your text never leaves your device and is not stored or shared."
    },
    {
      question: "Is there a limit to the text length?",
      answer: "We support texts up to several megabytes in size. For extremely long documents, your browser performance may be affected, but there is no hard numerical limit."
    }
  ],
  "password-generator": [
    {
      question: "Are the generated passwords truly random?",
      answer: "Yes, we use the browser's built-in cryptographic API (window.crypto.getRandomValues) to ensure high-quality, unpredictable randomness."
    },
    {
      question: "Can you see the passwords I generate?",
      answer: "No. The generation happens entirely on your local machine. We have no backend access to your generated strings."
    },
    {
      question: "What is the recommended password length?",
      answer: "For most accounts, we recommend at least 16 characters including uppercase, lowercase, numbers, and symbols for robust security."
    }
  ],
  "base64-codec": [
    {
      question: "Is Base64 a form of encryption?",
      answer: "No. Base64 is an encoding scheme used to represent binary data in text format. It provides no security and is easily reversible."
    },
    {
      question: "Can I encode images here?",
      answer: "This tool is for text. For images, please use our 'Image to Base64' tool in the sidebar or category list."
    },
    {
      question: "Are there any character limits?",
      answer: "You can process large amounts of text, but extremely large strings (over 50MB) may cause browser stutter during processing."
    }
  ],
  "json-formatter": [
    {
      question: "Does this tool validate my JSON?",
      answer: "Yes, if your JSON is malformed, the tool will highlight the error and help you fix syntax issues."
    },
    {
      question: "Is there a limit to the JSON size?",
      answer: "We can handle standard configuration and API response files up to several MBs with high speed and reliability."
    },
    {
      question: "What is the difference between Beautify and Minify?",
      answer: "Beautify adds whitespace and indentation for human readability. Minify removes all extra spaces to reduce file size for production."
    }
  ],
  "qr-generator": [
    {
      question: "Do these QR codes expire?",
      answer: "No. These are static QR codes. As long as the content (URLs or text) remains valid, the QR code will work forever."
    },
    {
      question: "Can I customize the colors?",
      answer: "Currently, we offer standard black-and-white codes to ensure maximum compatibility across all decoding hardware."
    },
    {
      question: "Does it support high error correction?",
      answer: "Yes, our generator includes standard error correction levels to ensure the code remains scannable even if slightly damaged or obscured."
    }
  ],
  "case-converter": [
    {
      question: "Does it support multi-line text?",
      answer: "Yes, the converter works perfectly with multiple paragraphs and preserves your line breaks."
    },
    {
      question: "What is Title Case?",
      answer: "Title Case capitalizes the first letter of each significant word, which is standard for book and article titles."
    },
    {
      question: "Are developer cases like camelCase supported?",
      answer: "Yes, we support camelCase, snake_case, PascalCase, and kebab-case for modern coding requirements."
    }
  ],
  "hash-generator": [
    {
      question: "Can I reverse a hash?",
      answer: "No. Hashing is a one-way cryptographic process. You cannot 'decrypt' a hash back into its original text."
    },
    {
      question: "Which algorithm should I use?",
      answer: "For standard security, SHA-256 is recommended. MD5 and SHA-1 are considered weak and should only be used for checksums."
    },
    {
      question: "Is hashing the same as encoding?",
      answer: "No. Encoding (like Base64) is reversible. Hashing (like SHA-256) is designed to be irreversible and unique to the input."
    }
  ],
  "bionic-reading": [
    {
      question: "Does it work for all languages?",
      answer: "It works best for Latin-based languages like English, Spanish, and French where word boundaries are clearly defined by spaces."
    },
    {
      question: "Can I export the formatted text?",
      answer: "Yes, you can copy the output. However, the bolding effect depends on whether the destination app supports HTML or rich text."
    },
    {
      question: "Does this really help with speed?",
      answer: "Many users report faster reading and better focus as the brain recognizes words more quickly using the fixation points."
    }
  ],
  "webcam-test": [
    {
      question: "Do you record my video or audio?",
      answer: "Never. The video stream is processed 100% locally in your browser and is never transmitted to any external server."
    },
    {
      question: "Why isn't my camera showing up?",
      answer: "Ensure you've granted browser permissions and that no other app (like Zoom or Teams) is currently occupying the camera."
    },
    {
      question: "Can I check my microphone here?",
      answer: "Yes, the tool includes a volume meter to verify audio input levels along with the visual video feed check."
    }
  ],
  "image-placeholder": [
    {
      question: "Can I use the URL directly in my HTML?",
      answer: "Yes! Our tool provides a dynamic URL that you can use in your <img> tags for rapid development and testing."
    },
    {
      question: "Is this tool free for commercial use?",
      answer: "Absolutely. All images generated can be used in personal, educational, and commercial projects without attribution."
    },
    {
      question: "What image formats are supported?",
      answer: "The dynamic URL generator primarily outputs SVG or standard web-compatible bitmap formats based on the configuration."
    }
  ],
  "image-to-base64": [
    {
      question: "Does Base64 increase file size?",
      answer: "Yes, Base64 encoding typically increases data size by about 33%. It is best for small icons or critical CSS assets."
    },
    {
      question: "Are my images uploaded to any server?",
      answer: "No. The conversion happens strictly in your browser using local resources. Your privacy is fully maintained."
    },
    {
      question: "Which formats are supported?",
      answer: "We support JPG, PNG, WEBP, and GIF formats for conversion to Base64 data strings."
    }
  ],
  "pdf-metadata": [
    {
      question: "Is my PDF data safe?",
      answer: "Yes. All metadata editing happens locally in your browser. Your PDF files are never uploaded to our servers."
    },
    {
      question: "Can I remove all metadata?",
      answer: "Yes, you can clear all fields (Author, Title, Creator) to effectively sanitize a document before sharing it."
    },
    {
      question: "Will this affect the PDF content?",
      answer: "No, this tool only modifies the descriptive metadata tags and does not alter the actual visual content or text of the document."
    }
  ],
  "jpg-to-pdf": [
    {
      question: "Is there a limit to the number of images?",
      answer: "There is no hard limit, though processing hundreds of high-res images at once may require more system RAM."
    },
    {
      question: "Can I reorder images?",
      answer: "Yes, you can use the Up/Down controls to arrange the images in the exact order you want them to appear in the PDF."
    },
    {
      question: "Are my photos private?",
      answer: "Yes. The conversion is done entirely client-side. We do not store or see any of your images."
    }
  ],
  "tweet-generator": [
    {
      question: "Is this for real tweeting?",
      answer: "No. This tool generates a realistic image mockup. It does not post anything to X (formerly Twitter)."
    },
    {
      question: "How do I download the tweet?",
      answer: "Once you've customized your tweet, click the download button to save the result as a high-quality PNG image."
    },
    {
      question: "Can I use external profile pictures?",
      answer: "Yes, you can upload any image to serve as the profile picture for your generated tweet mockup."
    }
  ],
  "html-entities": [
    {
      question: "What is horizontal encoding?",
      answer: "Encoding converts reserved characters like '<' into safe entities like '&lt;' so browsers render them correctly as text."
    },
    {
      question: "Does it support all HTML5 entities?",
      answer: "Yes, we support a comprehensive set of standard and extended HTML5 entities including mathematical symbols and accents."
    },
    {
      question: "Why use entities instead of raw text?",
      answer: "Entities prevent browsers from interpreting characters as code, protecting your site from layout breaks and XSS vulnerabilities."
    }
  ]
};
