"use client";
import { dmc } from "@/api/colors.json";
import { useState } from "react";
import "@/styles/_main.scss";
import { Title } from "@/components/Atoms/Title/Title";
import { InputContainer } from "@/components/InputContainer/InputContainer";

interface ColorsProps {
  code: string;
  name: string;
  distance?: number;
  rgb: number[];
}

export default function Home() {
  const [currentColor, setCurrentColor] = useState("");
  const [closestColors, setClosestColors] = useState<ColorsProps[]>(dmc);
  const [comparisonType, setComparisonType] = useState("hsl");

  const handleComparisonTypeChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setComparisonType(event.target.value);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentColor(event?.target.value);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const currentColorInRGB = convertHEXtoRGB(currentColor);

    const sortedColors = dmc
      .map((color) => {
        let distance = 0;
        if (comparisonType === "hsl") {
          distance = colorDistanceHSL(currentColorInRGB, color.rgb);
        } else {
          distance = colorDistance(currentColorInRGB, color.rgb);
        }

        return {
          ...color,
          distance,
        };
      })
      .sort((a, b) => a.distance - b.distance);

    setClosestColors(sortedColors.slice(0, 10));
  };

  const rgbToHsl = (r: number, g: number, b: number) => {
    r /= 255;
    g /= 255;
    b /= 255;

    const max = Math.max(r, g, b),
      min = Math.min(r, g, b);
    let h = (max + min) / 2;
    let s = (max + min) / 2;
    const l = (max + min) / 2;

    if (max === min) {
      h = s = 0; // achromático
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

      if (max === r) {
        h = (g - b) / d + (g < b ? 6 : 0);
      } else if (max === g) {
        h = (b - r) / d + 2;
      } else {
        h = (r - g) / d + 4;
      }
      h /= 6;
    }

    return [h * 360, s, l]; // Retorna HSL
  };

  const colorDistanceHSL = (rgb1: number[], rgb2: number[]) => {
    const hsl1 = rgbToHsl(rgb1[0], rgb1[1], rgb1[2]);
    const hsl2 = rgbToHsl(rgb2[0], rgb2[1], rgb2[2]);

    const lDiff = Math.abs(hsl1[2] - hsl2[2]);
    const sDiff = Math.abs(hsl1[1] - hsl2[1]);

    return lDiff * 2 + sDiff;
  };

  function colorDistance(rgb1: number[], rgb2: number[]) {
    const rDiff = rgb1[0] - rgb2[0];
    const gDiff = rgb1[1] - rgb2[1];
    const bDiff = rgb1[2] - rgb2[2];
    return Math.sqrt(rDiff * rDiff + gDiff * gDiff + bDiff * bDiff);
  }

  const convertHEXtoRGB = (hex: string) => {
    hex = hex.replace(/^#/, "");
    const bigint = parseInt(hex, 16);
    const rgb = [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255];
    return rgb;
  };

  return (
    <div className="color-finder">
      <Title text="Encontre a cor!" />

      <form onSubmit={handleSubmit} className="color-form">
        <fieldset className="fieldset fieldset-color">
          <InputContainer
            labelName="comparisonType"
            labelText="Escolha o tipo de comparação:"
          >
            <select
              id="comparisonType"
              value={comparisonType}
              onChange={handleComparisonTypeChange}
            >
              <option value="hsl">HSL</option>
              <option value="rgb">RGB</option>
            </select>
          </InputContainer>

          <InputContainer labelName="color" labelText="Cor (HEX):">
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
          </InputContainer>
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
