"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

type LiquidEtherProps = {
  className?: string;
};

/**
 * 首屏的「熔融金属」背景：以低频形变、金属高光和鼠标扰动营造流体质感。
 * 画布只负责氛围，不承载内容，因此在窄屏与减少动态偏好下会自动收敛。
 */
export default function LiquidEther({ className = "" }: LiquidEtherProps) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const scene = new THREE.Scene();
    const camera = new THREE.Camera();
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    mount.appendChild(renderer.domElement);

    const uniforms = {
      uTime: { value: 0 },
      uResolution: { value: new THREE.Vector2(1, 1) },
      uPointer: { value: new THREE.Vector2(0.7, 0.48) },
      uPointerTarget: { value: new THREE.Vector2(0.7, 0.48) },
      uVelocity: { value: 0 },
    };

    const material = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      uniforms,
      vertexShader: `varying vec2 vUv; void main(){vUv=uv;gl_Position=vec4(position,1.0);}`,
      fragmentShader: `
        precision highp float;
        varying vec2 vUv;
        uniform float uTime;
        uniform vec2 uResolution;
        uniform vec2 uPointer;
        uniform float uVelocity;
        float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453123);}
        float noise(vec2 p){
          vec2 i=floor(p), f=fract(p); f=f*f*(3.0-2.0*f);
          return mix(mix(hash(i),hash(i+vec2(1.,0.)),f.x),mix(hash(i+vec2(0.,1.)),hash(i+vec2(1.,1.)),f.x),f.y);
        }
        mat2 rotate2d(float a){return mat2(cos(a),-sin(a),sin(a),cos(a));}
        float fbm(vec2 p){
          float v=0.,a=.55;
          for(int i=0;i<6;i++){
            v+=a*noise(p);
            p=rotate2d(.43)*p*2.03+vec2(8.7,3.9);
            a*=.51;
          }
          return v;
        }
        float surface(vec2 p){
          float t=uTime*.055;
          vec2 q=vec2(fbm(p*1.05+vec2(t,-t*.72)),fbm(p*1.05+vec2(5.2,-2.7)+vec2(-t*.61,t)));
          vec2 r=vec2(fbm(p+q*1.9+vec2(1.7,9.2)),fbm(p+q*1.9+vec2(8.3,2.1)));
          return fbm(p+r*1.15+q*1.35);
        }
        void main(){
          vec2 uv=vUv-.5;
          uv.x*=uResolution.x/uResolution.y;
          vec2 pointer=uPointer-.5; pointer.x*=uResolution.x/uResolution.y;
          float distanceToPointer=length(uv-pointer);
          float contact=smoothstep(.72,.0,distanceToPointer);
          float pulse=sin(distanceToPointer*28.0-uTime*3.2)*.5+.5;
          vec2 displaced=uv*2.05+vec2(.75,-.1);
          displaced+=normalize(uv-pointer+vec2(.0001))*contact*(.16+.085*pulse)*uVelocity;
          float h=surface(displaced);
          float e=.008;
          float hx=surface(displaced+vec2(e,0.));
          float hy=surface(displaced+vec2(0.,e));
          vec3 normal=normalize(vec3((h-hx)*5.6,(h-hy)*5.6,.16));
          vec3 keyLight=normalize(vec3(-.45,.62,.8));
          vec3 rimLight=normalize(vec3(.72,-.26,.55));
          float diffuse=max(0.,dot(normal,keyLight));
          float specular=pow(max(0.,dot(reflect(vec3(0.,0.,-1.),normal),keyLight)),18.);
          float rim=pow(max(0.,dot(normal,rimLight)),8.);
          float flow=smoothstep(.34,.73,h);
          float vein=smoothstep(.44,.77,h+.12*sin((uv.x+uv.y)*4.5-uTime*.18));
          float core=smoothstep(.72,.02,length((uv-vec2(.28,.04))*vec2(.9,1.25)+normal.xy*.08));
          vec3 graphite=vec3(.024,.027,.033);
          vec3 iron=vec3(.16,.16,.18);
          vec3 plum=vec3(.43,.028,.08);
          vec3 ember=vec3(.94,.105,.032);
          vec3 gold=vec3(1.0,.48,.13);
          vec3 color=mix(graphite,iron,smoothstep(.12,.68,h)+diffuse*.3);
          color=mix(color,plum,flow*.94+core*.19);
          color=mix(color,ember,vein*.82+core*.25);
          color+=gold*(specular*1.38+rim*.25+contact*pulse*.2+core*.13);
          float vignette=smoothstep(1.18,.25,length(uv));
          float alpha=mix(.79,1.,vignette);
          gl_FragColor=vec4(color,alpha);
        }
      `,
    });

    scene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material));
    const clock = new THREE.Clock();

    const resize = () => {
      const { width, height } = mount.getBoundingClientRect();
      renderer.setSize(width, height, false);
      uniforms.uResolution.value.set(width, height);
    };
    const move = (event: PointerEvent) => {
      const rect = mount.getBoundingClientRect();
      if (
        event.clientX < rect.left || event.clientX > rect.right ||
        event.clientY < rect.top || event.clientY > rect.bottom
      ) return;
      uniforms.uPointerTarget.value.set(
        (event.clientX - rect.left) / rect.width,
        1 - (event.clientY - rect.top) / rect.height,
      );
      uniforms.uVelocity.value = 1;
    };

    let frame = 0;
    const render = () => {
      uniforms.uTime.value = clock.getElapsedTime();
      uniforms.uPointer.value.lerp(uniforms.uPointerTarget.value, 0.075);
      uniforms.uVelocity.value *= 0.94;
      renderer.render(scene, camera);
      frame = requestAnimationFrame(render);
    };
    const observer = new ResizeObserver(resize);
    observer.observe(mount);
    window.addEventListener("pointermove", move, { passive: true });
    resize();
    render();

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("pointermove", move);
      material.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return <div ref={mountRef} aria-hidden="true" className={`liquid-ether ${className}`} />;
}
