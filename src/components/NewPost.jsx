 /* eslint-disable */
 import {useEffect, useRef} from "react";
 import * as faceapi from 'face-api.js';
import { useState } from "react";
const NewPost = ({image}) => {
    const {url, width, height} = image;
    const imgRef = useRef();
    const canvasRef = useRef();
    const [faces, setFaces] = useState([])
    const [friends, setFriens] = useState([])
    const handleImage = async () => {
        // face detection part
        const detections = await faceapi.detectAllFaces(imgRef.current, new faceapi.SsdMobilenetv1Options())
        // .withFaceLandmarks().withFaceExpressions()

        console.log(detections)

        // detections.box -> {x, y, height, width}
        setFaces(detections.map(d => d.box))


        // Drawing on the canvas face lines and displaying expresions info on the screen canvas

        // canvasRef.current.innerHtml = faceapi.createCanvasFromMedia(imgRef.current);
        // faceapi.matchDimensions(canvasRef.current, {
        //     width,
        //     height
        // })

        // const resized = faceapi.resizeResults(detectionsWithLandmarks, {
        //     width,
        //     height
        // })

        // faceapi.draw.drawDetections(canvasRef.current, resized)
        // faceapi.draw.drawFaceExpressions(canvasRef.current, resized)
        // faceapi.draw.drawFaceLandmarks(canvasRef.current, resized)
    }

    const addFriend = (e) => {
        setFriens(prev => ({...prev, [e.target.name]: e.target.value}));
        console.log("friends", friends);
    }

    const showFaceRect = () => {
        const ctx = canvasRef.current.getContext("2d");
        ctx.lineWidth = 5;
        ctx.strokeStyle = 'yellow';
        faces.map((f) => ctx.strokeRect(...Object.values(f)))
    }

    useEffect(() => {
        console.log("use effect")
        const loadModels = () => {
        Promise.all([
            faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
            faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
            faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
            faceapi.nets.faceExpressionNet.loadFromUri('/models'),
            faceapi.nets.ssdMobilenetv1.loadFromUri('/models')
        ])
            .then(handleImage)
            .catch((e) => console.log(e))
        };

        imgRef.current && loadModels();
    }, [])
    return ( 
        <div className="container">
            <div className="left" style={{width, height}}>
                <img src={url} ref={imgRef} alt="uploaded image" crossOrigin="anonymous"/>
                <canvas onMouseEnter={showFaceRect} ref={canvasRef} width={width} height={height}/>
                <>
                {
                    faces.map((face, i) => (
                        console.log("face to map into input", face),
                        <input 
                            name={`input${i}`}
                            placeholder="Tag a friend" 
                            key={i} 
                            className="friendInput"
                            style={{left: face.x, top: face.y + face.height + 5}}
                            onChange={addFriend}>
                        </input>
                    ))
                }
                </>
            </div>
            <div className="right">
                <h1>Share your post</h1>
                <input 
                    type="text" 
                    placeholder="What's on your mind?"
                    className="rightInput"
                />
                {
                    Object.keys(friends).length !== 0 && (
                        <span className="friends">
                            With <span className="name">{Object.values(friends) + " "}</span>
                        </span>
                    )
                }
                <button className="rightButton">Send</button>
            </div>
        </div>
     );
}
 
export default NewPost;