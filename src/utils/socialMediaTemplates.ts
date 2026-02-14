export const defaultHTMLString = `<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Text Overlay Image</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Arial', sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            background-color: #f0f0f0;
        }

        .image-container {
            position: relative;
            width: 600px;
            height: 600px;
            border-radius: 0px;
            overflow: hidden;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        }

        .background-image {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }

        .overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.6);
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 40px;
        }

        .text-content {
            color: white;
            font-size: 28px;
            font-weight: bold;
            text-align: center;
            line-height: 1.4;
            text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
            max-width: 100%;
        }

        /* Responsive design */
        @media (max-width: 768px) {
            .image-container {
                width: 90vw;
                height: 90vw;
                max-width: 500px;
                max-height: 500px;
            }

            .text-content {
                font-size: 24px;
                padding: 20px;
            }
        }

        @media (max-width: 480px) {
            .text-content {
                font-size: 20px;
            }
        }
    </style>
</head>

<body>
    <div class="image-container">
        <!-- Replace this URL with your desired image -->
        <img 
  src="https://pixabay.com/get/someimage.jpg" 
  alt="Background Image"
  class="background-image"
  onerror="this.onerror=null; this.src='https://pixabay.com/get/gb52dd277e35164a093d8b5f997170ea89f81ee8ddb0ce80ec5a2c25b249363427fc672461e22f6904185da275bd77f46a3ceed4cb52c0473502be97344669dff_1280.jpg';"
/>

        <div class="overlay">
            <div class="text-content">
                <!-- Replace this text with your desired content -->
                Inspirational quote about life and not giving up
            </div>
        </div>
    </div>
</body>

</html>`;

export const gradientStyleHTMLString = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Text Overlay Template 2 - Gradient Style</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Arial', sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            background-color: #f0f0f0;
        }

        .image-container {
            position: relative;
            width: 600px;
            height: 600px;
            border-radius: 15px;
            overflow: hidden;
            box-shadow: 0 15px 40px rgba(0, 0, 0, 0.4);
        }

        .background-image {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }

        .overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, 
                rgba(74, 144, 226, 0.8) 0%, 
                rgba(153, 69, 255, 0.8) 50%, 
                rgba(255, 89, 145, 0.8) 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 50px;
        }

        .text-content {
            color: white;
            font-size: 32px;
            font-weight: 900;
            text-align: center;
            line-height: 1.3;
            text-shadow: 0 4px 8px rgba(0, 0, 0, 0.5);
            letter-spacing: -0.5px;
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            border-radius: 20px;
            padding: 40px;
            border: 1px solid rgba(255, 255, 255, 0.2);
        }

        /* Responsive design */
        @media (max-width: 768px) {
            .image-container {
                width: 90vw;
                height: 90vw;
                max-width: 500px;
                max-height: 500px;
            }
            
            .text-content {
                font-size: 26px;
                padding: 30px;
            }
            
            .overlay {
                padding: 30px;
            }
        }

        @media (max-width: 480px) {
            .text-content {
                font-size: 22px;
                padding: 25px;
            }
        }
    </style>
</head>
<body>
    <div class="image-container">
        <!-- Replace this URL with your desired image -->
        <img 
  src="https://pixabay.com/get/someimage.jpg" 
  alt="Background Image"
  class="background-image"
  onerror="this.onerror=null; this.src='https://pixabay.com/get/gb52dd277e35164a093d8b5f997170ea89f81ee8ddb0ce80ec5a2c25b249363427fc672461e22f6904185da275bd77f46a3ceed4cb52c0473502be97344669dff_1280.jpg';"
/>

        <div class="overlay">
            <div class="text-content">
                <!-- Replace this text with your desired content -->
                Inspirational quote about life and not giving up
            </div>
        </div>
    </div>
</body>
</html>
`

export const formalHTMLString = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Text Overlay Template 3 - Minimalist Style</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Arial', sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            background-color: #f0f0f0;
        }

        .image-container {
            position: relative;
            width: 600px;
            height: 600px;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 20px 50px rgba(0, 0, 0, 0.3);
        }

        .background-image {
            width: 100%;
            height: 100%;
            object-fit: cover;
            filter: brightness(0.4);
        }

        .overlay {
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 50%;
            background: linear-gradient(transparent, rgba(0, 0, 0, 0.9));
            display: flex;
            align-items: flex-end;
            justify-content: center;
            padding: 60px 40px;
        }

        .text-content {
            color: white;
            font-size: 30px;
            font-weight: 700;
            text-align: center;
            line-height: 1.4;
            text-shadow: 0 2px 10px rgba(0, 0, 0, 0.8);
            font-family: 'Georgia', serif;
            position: relative;
        }

        .text-content::before {
            content: '"';
            font-size: 60px;
            color: rgba(255, 255, 255, 0.6);
            position: absolute;
            top: -20px;
            left: -20px;
            font-family: serif;
        }

        .text-content::after {
            content: '"';
            font-size: 60px;
            color: rgba(255, 255, 255, 0.6);
            position: absolute;
            bottom: -40px;
            right: -20px;
            font-family: serif;
        }

        /* Accent line */
        .accent-line {
            position: absolute;
            top: 30%;
            left: 50%;
            transform: translateX(-50%);
            width: 80px;
            height: 4px;
            background: linear-gradient(90deg, #ff6b6b, #feca57);
            border-radius: 2px;
        }

        /* Responsive design */
        @media (max-width: 768px) {
            .image-container {
                width: 90vw;
                height: 90vw;
                max-width: 500px;
                max-height: 500px;
            }
            
            .text-content {
                font-size: 24px;
            }
            
            .overlay {
                padding: 40px 30px;
            }

            .text-content::before,
            .text-content::after {
                font-size: 40px;
            }

            .text-content::before {
                top: -15px;
                left: -15px;
            }

            .text-content::after {
                bottom: -25px;
                right: -15px;
            }
        }

        @media (max-width: 480px) {
            .text-content {
                font-size: 20px;
            }
        }
    </style>
</head>
<body>
    <div class="image-container">
        <!-- Replace this URL with your desired image -->
        <img 
  src="https://pixabay.com/get/someimage.jpg" 
  alt="Background Image"
  class="background-image"
  onerror="this.onerror=null; this.src='https://pixabay.com/get/gb52dd277e35164a093d8b5f997170ea89f81ee8ddb0ce80ec5a2c25b249363427fc672461e22f6904185da275bd77f46a3ceed4cb52c0473502be97344669dff_1280.jpg';"
/>

        <div class="overlay">
            <div class="text-content">
                <!-- Replace this text with your desired content -->
                Inspirational quote about life and not giving up
            </div>
        </div>
    </div>
</body>
</html>
`