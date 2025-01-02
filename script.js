document.addEventListener('DOMContentLoaded', () => {
    const startBuildingBtn = document.getElementById('start-building');
    const apiBuilder = document.getElementById('api-builder');
    const apiRequests = document.getElementById('api-requests');
    const generateCodeBtn = document.getElementById('generate-code');
    const addRequestBtn = document.getElementById('add-request');
    const initialSetup = document.getElementById('initial-setup');

    let requestCount = 0;

    // 3D Spider-web-like Animation
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('background-animation').appendChild(renderer.domElement);

    const geometry = new THREE.BufferGeometry();
    const material = new THREE.LineBasicMaterial({ color: 0x3f51b5, transparent: true, opacity: 0.5 });

    const points = [];
    const numPoints = 100;
    for (let i = 0; i < numPoints; i++) {
        const x = (Math.random() - 0.5) * 10;
        const y = (Math.random() - 0.5) * 10;
        const z = (Math.random() - 0.5) * 10;
        points.push(new THREE.Vector3(x, y, z));
    }

    geometry.setFromPoints(points);
    const line = new THREE.Line(geometry, material);
    scene.add(line);

    camera.position.z = 5;

    function animate() {
        requestAnimationFrame(animate);
        line.rotation.x += 0.001;
        line.rotation.y += 0.002;
        renderer.render(scene, camera);
    }

    animate();

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    startBuildingBtn?.addEventListener('click', () => {
        const apiCount = parseInt(document.getElementById('api-count').value);
        if (apiCount > 0) {
            initialSetup.classList.add('hidden');
            apiBuilder.classList.remove('hidden');
            apiRequests.innerHTML = '';
            for (let i = 0; i < apiCount; i++) {
                createApiRequestSection();
            }
            apiBuilder.classList.add('fade-in');
            window.scrollTo({
                top: apiBuilder.offsetTop,
                behavior: 'smooth'
            });
        }
    });

    generateCodeBtn?.addEventListener('click', generatePHPCode);

    addRequestBtn?.addEventListener('click', createApiRequestSection);

    function createApiRequestSection() {
        requestCount++;
        const section = document.createElement('div');
        section.classList.add('api-request', 'slide-in');
        section.innerHTML = `
            <h3>API Request ${requestCount}</h3>
            <button class="remove-request" data-request-id="${requestCount}">-</button>
            <div class="input-container">
                <input type="text" id="url-${requestCount}" placeholder=" ">
                <label for="url-${requestCount}">URL:</label>
                <span class="instruction">Enter the API endpoint URL</span>
            </div>
            <div class="input-container">
                <textarea id="headers-${requestCount}" rows="4" placeholder=" "></textarea>
                <label for="headers-${requestCount}">Headers:</label>
                <span class="instruction">Enter headers (one per line):
HEADER "return-client-request-id: false"
HEADER "client-request-id: 377ae168-2f6a-4903-a3df-e941ee9df166"
HEADER "correlation-id: 377ae168-2f6a-4903-a3df-e941ee9df166"
HEADER "User-Agent: Mozilla/5.0 (compatible; MSAL 1.0)"</span>
            </div>
            <div class="input-container">
                <select id="method-${requestCount}">
                    <option value="GET">GET</option>
                    <option value="POST">POST</option>
                </select>
                <label for="method-${requestCount}">Method:</label>
                <span class="instruction">Select the HTTP method</span>
            </div>
            <div id="post-section-${requestCount}" class="hidden">
                <div class="input-container">
                    <select id="content-type-${requestCount}">
                        <option value="application/x-www-form-urlencoded">Form Data</option>
                        <option value="application/json">JSON</option>
                        <option value="multipart/form-data">Multipart Form Data</option>
                        <option value="text/xml">XML</option>
                    </select>
                    <label for="content-type-${requestCount}">Content Type:</label>
                    <span class="instruction">Select the content type for POST requests</span>
                </div>
                <div class="input-container">
                    <textarea id="post-data-${requestCount}" rows="4" placeholder=" "></textarea>
                    <label for="post-data-${requestCount}">POST Data:</label>
                    <span class="instruction">Enter POST data</span>
                </div>
            </div>
            <div class="input-container">
                <select id="parsing-${requestCount}">
                    <option value="no">No</option>
                    <option value="yes">Yes</option>
                </select>
                <label for="parsing-${requestCount}">Parsing Needed:</label>
                <span class="instruction">Select if parsing is needed for the response</span>
            </div>
            <div id="parsing-section-${requestCount}" class="hidden">
                <div class="input-container">
                    <input type="text" id="parse-key-${requestCount}" placeholder=" ">
                    <label for="parse-key-${requestCount}">Parse Key:</label>
                    <span class="instruction">Enter the key to parse from the response</span>
                </div>
                <div class="input-container">
                    <input type="text" id="parse-variable-${requestCount}" placeholder=" ">
                    <label for="parse-variable-${requestCount}">Variable Name:</label>
                    <span class="instruction">Enter the variable name for the parsed value</span>
                </div>
            </div>
            <div class="checkbox-group">
                <div class="input-container">
                    <input type="checkbox" id="show-raw-${requestCount}">
                    <label for="show-raw-${requestCount}">Show Raw Response</label>
                </div>
                <div class="input-container">
                    <input type="checkbox" id="save-raw-${requestCount}">
                    <label for="save-raw-${requestCount}">Save Raw Response</label>
                </div>
            </div>
        `;

        apiRequests.appendChild(section);

        const methodSelect = section.querySelector(`#method-${requestCount}`);
        const postSection = section.querySelector(`#post-section-${requestCount}`);
        const parsingSelect = section.querySelector(`#parsing-${requestCount}`);
        const parsingSection = section.querySelector(`#parsing-section-${requestCount}`);
        const contentTypeSelect = section.querySelector(`#content-type-${requestCount}`);
        const postDataTextarea = section.querySelector(`#post-data-${requestCount}`);
        const removeRequestBtn = section.querySelector('.remove-request');

        methodSelect.addEventListener('change', () => {
            postSection.classList.toggle('hidden', methodSelect.value !== 'POST');
        });

        parsingSelect.addEventListener('change', () => {
            parsingSection.classList.toggle('hidden', parsingSelect.value !== 'yes');
        });

        contentTypeSelect.addEventListener('change', () => {
            updatePostDataPlaceholder(contentTypeSelect.value, postDataTextarea);
        });

        removeRequestBtn.addEventListener('click', (e) => {
            const requestId = e.target.getAttribute('data-request-id');
            removeApiRequestSection(requestId);
        });

        updatePostDataPlaceholder(contentTypeSelect.value, postDataTextarea);

        // Add event listeners for input fields
        section.querySelectorAll('input, select, textarea').forEach(element => {
            element.addEventListener('focus', () => {
                element.parentElement.querySelector('.instruction')?.classList.add('visible');
            });

            element.addEventListener('blur', () => {
                element.parentElement.querySelector('.instruction')?.classList.remove('visible');
            });

            element.addEventListener('input', () => {
                if (element.value) {
                    element.parentElement.querySelector('.instruction')?.classList.remove('visible');
                }
            });
        });
    }

    function removeApiRequestSection(requestId) {
        const section = document.querySelector(`.api-request:nth-child(${requestId})`);
        if (section) {
            section.remove();
            renumberRequests();
        }
    }

    function renumberRequests() {
        const requests = document.querySelectorAll('.api-request');
        requests.forEach((request, index) => {
            const heading = request.querySelector('h3');
            heading.textContent = `API Request ${index + 1}`;
            request.querySelector('.remove-request').setAttribute('data-request-id', index + 1);
        });
        requestCount = requests.length;
    }

    function updatePostDataPlaceholder(contentType, textarea) {
        switch (contentType) {
            case 'application/json':
                textarea.placeholder = 'Enter JSON data:\n{\n  "key": "value",\n  "array": [1, 2, 3]\n}';
                break;
            case 'application/x-www-form-urlencoded':
                textarea.placeholder = 'Enter form data (key=value pairs):\nusername=john&password=secret';
                break;
            case 'multipart/form-data':
                textarea.placeholder = 'Enter multipart form data:\nfile=@/path/to/file.jpg\nusername=john';
                break;
            case 'text/xml':
                textarea.placeholder = 'Enter XML data:\n<root>\n  <element>value</element>\n</root>';
                break;
        }
    }

    function generatePHPCode() {
        const apiRequests = document.querySelectorAll('.api-request');
        let code = "<?php\n\n";

        apiRequests.forEach((request, index) => {
            const requestId = index + 1;
            const url = request.querySelector(`#url-${requestId}`).value;
            const method = request.querySelector(`#method-${requestId}`).value;
            const headers = request.querySelector(`#headers-${requestId}`).value;
            const contentType = request.querySelector(`#content-type-${requestId}`)?.value;
            const postData = request.querySelector(`#post-data-${requestId}`)?.value;
            const parsing = request.querySelector(`#parsing-${requestId}`).value;
            const parseKey = request.querySelector(`#parse-key-${requestId}`)?.value;
            const parseVariable = request.querySelector(`#parse-variable-${requestId}`)?.value;
            const showRaw = request.querySelector(`#show-raw-${requestId}`).checked;
            const saveRaw = request.querySelector(`#save-raw-${requestId}`).checked;

            code += `// API Request ${requestId}\n`;
            code += `$ch${requestId} = curl_init();\n`;
            code += `curl_setopt($ch${requestId}, CURLOPT_URL, "${url}");\n`;
            code += `curl_setopt($ch${requestId}, CURLOPT_RETURNTRANSFER, true);\n`;

            // Headers
            code += `$headers = [];\n`;
            headers.split('\n').forEach(header => {
                const headerMatch = header.match(/^(?:HEADER\s*)?"(.+?):\s*(.+?)"$/);
                if (headerMatch) {
                    const [, key, value] = headerMatch;
                    code += `$headers[] = "${key}: ${value}";\n`;
                }
            });
            code += `curl_setopt($ch${requestId}, CURLOPT_HTTPHEADER, $headers);\n`;

            if (method === 'POST') {
                code += `curl_setopt($ch${requestId}, CURLOPT_POST, 1);\n`;
                code += `curl_setopt($ch${requestId}, CURLOPT_POSTFIELDS, ${JSON.stringify(postData)});\n`;
                code += `curl_setopt($ch${requestId}, CURLOPT_HTTPHEADER, array_merge($headers, ['Content-Type: ${contentType}']));\n`;
            }

            code += `\n$response${requestId} = curl_exec($ch${requestId});\n`;
            code += `\nif (curl_errno($ch${requestId})) {\n`;
            code += `    echo 'Error: ' . curl_error($ch${requestId});\n`;
            code += `}\n`;

            if (showRaw) {
                code += `\necho "Raw Response:\\n" . $response${requestId} . "\\n";\n`;
            }

            if (saveRaw) {
                code += `\nfile_put_contents("raw_response_${requestId}.txt", $response${requestId});\n`;
            }

            if (parsing === 'yes') {
                code += `\n$decoded_response${requestId} = json_decode($response${requestId}, true);\n`;
                code += `$${parseVariable} = $decoded_response${requestId}${parseKey.split('.').map(key => `['${key}']`).join('')};\n`;
                code += `echo "${parseVariable}: " . $${parseVariable} . "\\n";\n`;
            }

            code += `\ncurl_close($ch${requestId});\n\n`;
        });

        code += "?>";

        // Redirect to the generated code page
        sessionStorage.setItem('generatedCode', code);
        window.location.href = 'generated-code.html';
    }
});

