
import * as THREE from './lib/three.module.js';
import { FBXLoader } from './lib/FBXLoader.js';

window.onload = function() {

    // GSAP
	const textBlock = document.querySelector('#slogan');
    const sentence = document.querySelector('.slogan__sentence');
    sentence.innerHTML = sentence.innerHTML.split('').map(item=>`<div class="slogan__letter">${(item!=' ')?item:'&nbsp;'}</div>`).join('')

	const tl = new TimelineMax({repeat:0,repeatDelay:1});
    tl.staggerTo(".slogan__letter",1,{y:-30,opacity:1,delay:1,ease:Power2.ease,repeat:0,lazy:true},0.05);
    textBlock.style.opacity = '1';

    // THREE JS
    let container, camera, scene, renderer, light, light2, loader;

    container = document.createElement( 'div' );
    document.querySelector('#sculpture').appendChild( container );
    
    init();
    animate();

    function init() {

        camera = new THREE.PerspectiveCamera( 35, window.innerWidth / window.innerHeight, 0.1, 15 );
        camera.position.set( 4, -0.09, 3 );
        scene = new THREE.Scene();

        // LIGHT
        light = new THREE.AmbientLight( 0xffffff, 0.7 );
        scene.add( light );
        light2 = new THREE.PointLight( 0xffffff, 0.5 );
        scene.add( light2 );

        // MODEL
        loader = new FBXLoader();
        loader.load( '../img/sculptureTTLOWWithDownSide.fbx', function ( object ) {
            object.scale.set( 0.0013, 0.0013, 0.0013 );
            scene.add( object );
        } );

        renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setClearColor( 0xffffff );
        renderer.setPixelRatio( window.devicePixelRatio );
        renderer.setSize( window.innerWidth, window.innerHeight );
        container.appendChild( renderer.domElement );

        window.addEventListener( 'resize', onWindowResize, false );

    }

    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize( window.innerWidth, window.innerHeight );
    }

    function animate() {
        render();
        requestAnimationFrame( animate );
    }

    function render() {
        let timer = Date.now() * 0.0003;
        camera.position.x = Math.sin( timer ) * 0.5;
        camera.position.z = Math.cos( timer ) * 0.5;
        camera.lookAt( 0.01, 0.11, 0 );
        renderer.render( scene, camera );
    }

    // CURSOR RED DOT
    let canvasCursor = document.createElement('canvas');
    canvasCursor.setAttribute('id','myCanvas');
    canvasCursor.setAttribute('width', window.innerWidth);
    canvasCursor.setAttribute('height', window.innerHeight);
    let cursor = document.querySelector("#cursor");
    cursor.appendChild(canvasCursor);

    let context = canvasCursor.getContext("2d");

    function getPosition(el) {
        let xPosition = 0;
        let yPosition = 0;

        while (el) {
            xPosition += (el.offsetLeft - el.scrollLeft + el.clientLeft);
            yPosition += (el.offsetTop - el.scrollTop + el.clientTop);
            el = el.offsetParent;
        }
        return {
            x: xPosition,
            y: yPosition
        };
    }
    let canvasPos = getPosition(canvasCursor);
    let mouseX = 0;
    let mouseY = 0;

    
    canvasCursor.addEventListener("mousemove", setMousePosition, false);
    
    const fakeSentence = sentence.cloneNode(true);
    fakeSentence.classList.add('slogan-plus');
    textBlock.appendChild(fakeSentence)

    fakeSentence.addEventListener("mousemove", setMousePositionTxt, false);
    
    let r = 20
    function setMousePosition(e) {
        mouseX = e.clientX - canvasPos.x;
        mouseY = e.clientY - canvasPos.y;
        context.clearRect (0, 0, canvasCursor.width, canvasCursor.height);
        context.beginPath();
        context.arc(mouseX, mouseY, (r<20)?20:r--, 0, 2 * Math.PI, true);
        context.fillStyle = "#c14121";
        context.fill();
    }
    
    function setMousePositionTxt(e) {
        mouseX = e.clientX - canvasPos.x;
        mouseY = e.clientY - canvasPos.y;
        context.clearRect (0, 0, canvasCursor.width, canvasCursor.height);
        context.beginPath();        
        context.arc(mouseX, mouseY, (r<50)?r++:50, 0, 2 * Math.PI, true);
        context.fillStyle = "rgba(193, 65, 33, 0.9)";
        context.fill();
    }


}