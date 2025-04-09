# Vintom in Angular 19: Creating Personalized Videos with Data Security

Read the [original post](https://dev.to/gydunhn/vintom-in-angular-19-32fm) for this documentation

## Personalized Video Solution

Today I want to share with you a project I just completed: a proof of concept (POC) that integrates the Vintom tool for personalized videos with Angular 19. If you're looking for a way to implement personalized and dynamic videos in your Angular applications while maintaining complete control over your users' data, this article is for you.

## What is Vintom and why should you care?

Vintom is a powerful platform that allows you to create and play dynamically personalized videos. Imagine being able to show each user a video that includes their name, food preferences, clothing size, security data, banking information, or investment details. In short, data that belongs only to the user, specific information relevant to them. The possibilities for personalized marketing, user onboarding, or personalized communications are enormous.

What makes this implementation especially interesting is that it uses the **"Data in Client's Infrastructure"** mode, which means that all user data is processed directly in the client's browser. This ensures maximum security for sensitive information, as no personal data is sent to external servers.

## Main Features of the Implementation

Our integration of Vintom with Angular 19 includes:

- 🔒 **100% client-side processing**: All data remains in the user's browser
- 🌍 **Multilingual subtitle support**: Implemented for English, Spanish, and Polish
- 🎨 **Visual customization**: Customization options including colors, images, and graphics

    > everything that Vintom offers from its DEMO documentation.

## A Look at the Code

Implementing the Vintom player in Angular is surprisingly simple. Here's a snippet of how we initialize the player:

```typescript
// Vintom player initialization
this.videoPlayer = new window.vintom.Player()
  .initialize(containerId)
  .personalize(playerData)
  .run();
```

The customization form allows users to select different parameters for their video:

| Parameter            | Description                                     |
| -------------------- | ----------------------------------------------- |
| Name                 | Selection of predefined names                   |
| Language (subtitles) | English, Spanish, or Polish                     |
| Image                | Different visual options (flower, fish, car...) |
| Color                | Customizable color palette                      |
| Percentage           | Numerical value for graphics (0-100%)           |
| Chart Type           | Pie chart or bar chart                          |
| CTA URL              | URL for customized call-to-action               |

## Technical Challenges and Solutions

One of the main challenges was correctly handling video playback errors. We implemented a global error handler that specifically captures common playback issues:

```typescript
setupErrorHandler(): void {
  window.addEventListener('unhandledrejection', (event) => {
    if (event.reason?.name === 'AbortError' || 
        event.reason?.message?.includes('play() request was interrupted')) {
      event.preventDefault();
      event.stopPropagation();
    }
  });
}
```

This approach prevents non-critical errors during playback from affecting the user experience.

## Results and Learnings

After completing the proof of concept, I can confirm that:

1. **Angular 19 and Vintom are fully compatible**: The integration is smooth and efficient
2. **Client-side processing works perfectly**: There are no significant performance issues
3. **User experience is excellent**: Videos are generated quickly, and playback is smooth
4. **Data security is guaranteed**: No personal data leaves the user's browser

## Technical Requirements

If you want to implement something similar, you'll need:

- Node.js 16.x or higher
- Angular CLI 19.x
- Modern browsers (Chrome 50+, Firefox 50+, Safari 10+, Edge 15+)

Don't forget to include the necessary scripts in your `index.html`:

```html
<script src="https://player.vintom.com/player/2.15.2/index.js"></script>
<link rel="stylesheet" href="https://player.vintom.com/player/2.15.2/public/css/style.css">
```

## What's Next?

This proof of concept demonstrates the potential of Vintom in Angular applications, but there are several directions in which we could expand the project:

- Explore the hybrid infrastructure mode for more complex use cases
- Add interaction analytics to measure the effectiveness of videos
- Integrate with CRM systems for user data-based personalization

## In Conclusion

The integration of Vintom with Angular 19 opens new possibilities for offering personalized user experiences without compromising data security. This client-centered approach represents the future of multimedia content personalization, where privacy and user experience go hand in hand.

*This article is based on a real proof of concept. The code and techniques mentioned have been tested in a development environment.*
