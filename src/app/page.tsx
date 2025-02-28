"use client";
import { dmc } from "@/api/colors.json";
import { useState } from "react";
import "@/styles/_main.scss";

interface ColorsProps {
  code: string;
  name: string;
  distance?: number;
  rgb: number[];
}

export default function Home() {
  const [currentColor, setCurrentColor] = useState("");
  const [closestColors, setClosestColors] = useState<ColorsProps[]>(dmc);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentColor(event?.target.value);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const currentColorInRGB = convertHEXtoRGB(currentColor);

    const sortedColors = dmc
      .map((color) => ({
        ...color,
        distance: colorDistance(currentColorInRGB, color.rgb),
      }))
      .sort((a, b) => a.distance - b.distance);

    setClosestColors(sortedColors.slice(0, 5));

    console.log("Valor: ", currentColor, sortedColors);
  };

  function colorDistance(rgb1: number[], rgb2: number[]) {
    return Math.sqrt(
      Math.pow(rgb1[0] - rgb2[0], 2) +
        Math.pow(rgb1[1] - rgb2[1], 2) +
        Math.pow(rgb1[2] - rgb2[2], 2)
    );
  }

  const convertHEXtoRGB = (hex: string) => {
    hex = hex.replace(/^#/, "");
    const bigint = parseInt(hex, 16);
    return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255];
  };

  return (
    <div className="color-finder">
      <h1 className="title">Encontre a cor!</h1>

      <form onSubmit={handleSubmit} className="color-form">
        <fieldset className="fieldset fieldset-color">
          <label htmlFor="color" className="label">
            Cor (HEX):
          </label>
          <input
            type="text"
            id="color"
            name="color"
            placeholder="#000000"
            onChange={handleChange}
            value={currentColor}
            className="input"
          />

          <button type="submit" className="submit-btn">
            Enviar
          </button>
        </fieldset>

        <output className="output">
          <p className="output-title">Resultado:</p>
          <ul className="color-list">
            {closestColors.map((color) => {
              return (
                <li key={color.code} className="color-item">
                  <div
                    className="color-box"
                    style={{
                      backgroundColor: `rgb(${color.rgb.join(",")})`,
                    }}
                  ></div>
                  <p className="color-code">{color.code}</p>
                  <p className="color-name">{color.name}</p>
                  <p className="color-rgb">RGB({color.rgb.join(", ")})</p>
                </li>
              );
            })}
          </ul>
        </output>
      </form>
    </div>
  );
}
