/**
 * Google InputTools Handwriting Recognition API
 * 
 * Converts hand-drawn strokes into Japanese characters
 */

/**
 * Recognize handwritten Japanese characters using Google InputTools API
 * 
 * @param {Array<Array<[number, number]>>} strokes - Array of stroke paths, each stroke is an array of [x, y] coordinates
 * @param {number} w - Width of the writing area in pixels
 * @param {number} h - Height of the writing area in pixels
 * @returns {Promise<string[]>} Array of recognized characters ordered by confidence
 */
export async function recognizeInk(strokes, w, h) {
  // Format strokes for Google API: separate x and y coordinates
  const ink = strokes.map((s) => [
    s.map((p) => Math.round(p[0])), // x coordinates
    s.map((p) => Math.round(p[1])), // y coordinates
  ])

  const body = JSON.stringify({
    options: 'enable_pre_space',
    requests: [
      {
        writing_guide: {
          writing_area_width: w,
          writing_area_height: h,
        },
        ink,
        language: 'ja',
      },
    ],
  })

  const res = await fetch(
    'https://www.google.com/inputtools/request?ime=handwriting&app=mobilesearch&cs=1&oe=UTF-8',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
    }
  )

  const data = await res.json()
  
  // Extract candidate characters from response
  // Response format: [status, [[type, [candidates, ...]], ...]]
  return data?.[1]?.[0]?.[1] ?? []
}
